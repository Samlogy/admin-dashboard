import React, { useState, useEffect } from "react";
import { BiBlock, BiTrash, BiPencil, BiDetail, BiUser } from "react-icons/bi"
import { AiOutlineUserAdd } from "react-icons/ai"
import { FormControl, FormLabel, Input, Select, Checkbox, Text, Heading, Radio, RadioGroup, Textarea,
  Spinner,
  Table, Thead, Tbody, Tfoot, Tr, Th, Td,
  useToast,
  Flex, Stack, Box, 
  Avatar,
  Button, ButtonGroup, IconButton,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, 
  useDisclosure,
  Link, Image,
  InputRightElement, InputGroup,
   } from "@chakra-ui/react"
import { FaCog, FaChevronDown, FaTransgender, FaUserLock, FaEnvelope } from "react-icons/fa";
import { MdLocationOn, MdPhoneIphone } from "react-icons/md"
import { GoPrimitiveDot } from "react-icons/go" 
import { GiRank3 } from "react-icons/gi"

import NavBar from "../../Components/NavBar/NavBar.jsx"

const Users = () => {
  const [user, setUser] = useState({ 
      fullName: "", username: "", phone: "", address: "", active: "false", gender: "male", email: "", password: "", confirmPassword: "", role: "" 
    });
  const [showPwd, setShowPwd] = useState({ pass: false, confirmPass: false })
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState({ queryString: "", filterType: "role" });
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState({ value: "users", data: null })

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()

  const proxy = 'http://localhost:5000'

  // Functions
  const hidePassword = (password) => {
    return "*".repeat(password.length)
  };
  const convertDate = (date) => {
    const new_date = new Date(date).toLocaleDateString("en-US").split(/:| /)[0];
    return new_date;
  };
  const backToUsers = () => {
    setAction({ value: "users" })
    setUser({ fullName: "", username: "", email: "", password: "", role: "" })
  };

  const deleteUser = (userId, userIndex) => {
    setAction({ 
      data: { text: "Are you sure to delete this user ?", 
      action: () => onDelete(userId, userIndex), label: "Delete" } 
    }); 
    onOpen()
  };
  const editUser = (userId, userIndex, userData) => {
    setAction({ value: "edit", data: {userId, userIndex}}); 
    setUser(userData)
  };
  const blockUser = (userId, userIndex) => {
    setAction({ 
      data: { text: "Are you sure to delete this user ?", 
      action: () => onBlock(userId, userIndex), label: "Block" }
    }); 
    onOpen()
  };
  const detailsUser = (userData, userIndex) => {
    setAction({ value: "details", data:{ productIndex: userIndex } })
    setUser(userData)
  };

  // API calls
  const getUsers = async () => {
    setLoading(true);
    try {
      const url = `${proxy}/admin/manageUser/getUsers`;
      const res = await fetch(url);

      if (res.ok) {
        const result = await res.json();
        setLoading(false);
        setUsers(result.data);

        return;
      }
      displayToast({msg: "an Error occured while loading users !", status: "error"})

    } catch (err) {
      displayToast({msg: `Error: ${err.message}`, status: "error"})
    }
  };
  const onCreate = async () => {
    if (user.password !== user.confirmPassword) {
      displayToast({msg: "password & confirm password do not match !", status: "error"})
    }
    delete user.confirmPassword

    try {
      // data validation (yup)
      const url = `${proxy}/admin/manageUser/createUser`;
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(user)
      });
      // reset form
      setUsers({ email: "", password: "", role: "" });

      if (res.ok) {
        const result = await res.json();
        displayToast({msg: result.message, status: "success"})
        return;
      }
      displayToast({msg: "an Error occured while adding a user !", status: "error"})

    } catch (err) {
      displayToast({msg: `Error: ${err.message}`, status: "error"})
    }
  };
  const onEdit = async (userId, userIndex) => {
    try {
      // data validation
      let editedUser = users[userIndex];
      // remove password from obj if do not change
      if (editedUser.password === "") {
        delete editedUser.password;
      }

      const url = `${proxy}/admin/manageUser/editUser/${userId}`;
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "PUT",
        body: JSON.stringify(editedUser)
      });

      if (res.ok) {
        const result = await res.json();
        displayToast({msg: result.message, status: "success"})
        return;
      }
      displayToast({msg: "an Error occured during user edition !", status: "error"})
    } catch (err) {
      displayToast({msg: `Error: ${err.message}`, status: "error"})
    }
  };
  const onDelete = async (userId) => {
    try {
      const url = `${proxy}/admin/manageUser/deleteUser/${userId}`;
      const res = await fetch(url, {
        method: "DELETE"
      });

      if (res.ok) {
        const result = await res.json();

        // remove user data from users
        const new_users_list = users.filter((el) => el._id !== userId);
        setUsers(new_users_list);

        displayToast({msg: result.message, status: "success"})
        return;
      }
      displayToast({msg: "an Error occured while deleting user !", status: "error"})

    } catch (err) {
      displayToast({msg: `Error: ${err.message}`, status: "error"})
    }
  };
  const onBlock = async (userId, userIndex) => {
    try {
      const url = `${proxy}/admin/manageUser/blockUser/${userId}`;
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "PUT",
        body: JSON.stringify({ active: !users[userIndex].active })
      });
      
      if (res.ok) {
        const result = await res.json();

        setUsers((prevState) => {
          let newState = [...prevState];

          newState.forEach((item) => {
              if (item._id === userId) {
                item.active = !users[userIndex].active
              }
          });
          return newState;
        })
        displayToast({msg: result.message, status: "succes"})
        return;
      }
      displayToast({msg: "an Error occured while blocking user !", status: "error"})

    } catch (err) {
      displayToast({msg: `Error: ${err.message}`, status: "error"})
    }
  };
  const onFilter = async (value) => {
    setFilter({ ...filter, queryString: value });
    setLoading(true);

    try {
      const url = `${proxy}/admin/manageUser/filterUsers?queryString=${value}&filterType=${filter.filterType}`;
      const res = await fetch(url);

      if (res.ok) {
        const result = await res.json();
        // setFilter({ ...filter, response: result.data });
        console.log('users: ', result.data)
        setUsers(result.data);
        setLoading(false);
        console.log(result.message);
        return;
      }
      console.log("an Error occured while filtering users !");
    } catch (err) {
      console.log("Error: ", err.message);
    }
  };


  const usersOnChange = (e) => {
      setUsers((prevState) => {
          let newState = [...prevState];

          newState.forEach((item) => {
              if (item._id === e.target.id) {
                item[e.target.name] = e.target.value;
              }
          });
          return newState;
      })
  };

  // Componenents
  const displayToast = (data) => {
    const { msg, status } = data
    return toast({
      title: msg,
      status: status,
      variant: "top-accent",
      position: "bottom-right", // "top-right"
      duration: 5000,
      isClosable: true,
    })
  };
  const displayModal = (data) => {
    const { text, action, label } = data
    return  <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader> { label && label } </ModalHeader>
                <ModalCloseButton />
                <ModalBody> { text && text } </ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={action && action}>
                    { label && label }
                  </Button>
                  <Button variant="outiline" colorScheme="blue" onClick={() => { backToUsers(); onClose()}}> Cancel </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
  };
  const displayUsersList = (users) => {
     
    return (
      <>
      <Table variant="simple" border="1px" borderWidth="solid" borderColor="gray.200" colorScheme="blue" size="sm" w="95%" mx="auto">
        <Thead>
          <Tr>
            <Th p="1rem"> <Checkbox colorScheme="blue" size="md" defaultIsChecked={false}></Checkbox> </Th>
            <Th p="1rem"> Email </Th>
            <Th p="1rem"> Password </Th>
            <Th p="1rem"> Role </Th>
            <Th p="1rem"> Actions </Th>
            <Th p="1rem"> Created </Th>
            <Th p="1rem"> Last Edit </Th>
          </Tr>
        </Thead>
        
        <Tbody>
          { users.map((el, idx) => 
            <Tr index={idx}>
              <Td>
                <Checkbox colorScheme="blue" size="md" defaultIsChecked={false}></Checkbox>
              </Td>
              <Td>
                <Input type="email" placeholder="Email" name="email"
                      id={el._id} value={el.email} onChange={e => usersOnChange(e)} />
              </Td>
              <Td>
                <Input type="password" placeholder="Password" name="password"
                      id={el._id} value={el.password} onChange={e => usersOnChange(e)} />
              </Td>
              <Td>
                  <Select id={el._id} value={el.role} onChange={e => usersOnChange(e)}>
                    <option value="moderator"> Moderator </option>
                    <option value="admin"> Admin </option>
                  </Select>
              </Td>
              <Td>
                <ButtonGroup variant="outline" colorScheme="blue" ml="0" spacing="6" display={"flex"} flexDirection="column" 
                            justifyContent="center" alignItems="center" >
                  <IconButton colorScheme="blue" aria-label="edit user" my=".25rem" icon={<BiPencil />} 
                          onClick={() =>  editUser(el._id, idx, el)} />

                  <IconButton colorScheme="blue" aria-label="delete user" my=".25rem"  icon={<BiTrash />}
                          onClick={() => deleteUser(el._id, idx)} />
                              
                  <IconButton colorScheme="blue" aria-label="block user" my=".25rem" icon={<BiBlock />} 
                        onClick={() => blockUser(el._id, idx)} />

                  <IconButton colorScheme="blue" aria-label="details user" my=".25rem" icon={<BiDetail />}
                          onClick={() => detailsUser(el)} />
                </ButtonGroup>
              </Td>
              <Td> {el.createdAt && convertDate(el.createdAt)} </Td>
              <Td> {el.editedAt ? convertDate(el.editedAt) : "not updated "} </Td>
            </Tr>
          )
        }
        </Tbody>

        <Tfoot>
          <Tr>
            <Th p="1rem"> <Checkbox colorScheme="blue" size="md" defaultIsChecked={false}></Checkbox> </Th>
            <Th p="1rem"> Email </Th>
            <Th p="1rem"> Password </Th>
            <Th p="1rem"> Role </Th>
            <Th p="1rem"> Actions </Th>
            <Th p="1rem"> Created </Th>
            <Th p="1rem"> Last Edit </Th>
          </Tr>
        </Tfoot>
      </Table>
     
      </>
    )
  };
  const displayAddUser = () => {
    return (
      <>
        <Box display="flex" flexDirection="row" justifyContent="center" >
        {displayUserDetails()}

        <Box border="1px" borderColor="gray.200" borderStyle="solid" p="1rem" borderRadius="md" width="500px" ml="1rem">
          <Heading as="h3" size="md" my="1rem" textAlign="left"> Add new User </Heading>

          <Stack>
            <Image boxSize="150px" borderRadius="md" mb="1rem" mr="auto" alt={user.username} fallbackSrc="https://via.placeholder.com/150"
                    src={user.avatar} />
            <Input type="file" id="file" 
                    value={user.avatar} onChange={(e) => setUser({ ...user, avatar: e.target.value })} />

            <FormControl id="fullName" mb="1rem">
              <FormLabel> Full Name </FormLabel>
              <Input type="text" placeholder="Full Name" name="fullName"
                  id="fullName" value={user.fullName} onChange={(e) => setUser({ ...user, fullName: e.target.value })} />
            </FormControl>

            <FormControl id="email" mb="1rem">
              <FormLabel> Email </FormLabel>
              <Input type="email" placeholder="Email" name="email"
                  id="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
            </FormControl>

            <FormControl id="phone" mb="1rem">
              <FormLabel> Phone </FormLabel>
              <Input type="text" placeholder="Phone" name="phone"
                  id="phone" value={user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} />
            </FormControl>

            <FormControl id="phone" mb="1rem">
              <FormLabel> gender </FormLabel> 
              <RadioGroup id="gender" name="gender" value={user.gender}
                          onChange={(e) => setUser({ ...user, gender: e })}>
                <Stack direction="row">
                  <Radio value="male"> Male </Radio>
                  <Radio value="female"> Female </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl id="active" mb="1rem">
              <FormLabel> Active </FormLabel>
              <RadioGroup id="active" name="active" value={user.active}
                          onChange={(e) => setUser({ ...user, active: e })}>
                <Stack direction="row">
                  <Radio value="false"> No </Radio>
                  <Radio value="true"> Yes </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl id="address" mb="1rem">
              <FormLabel> Address </FormLabel>
              <Textarea placeholder="Address" name="address" id="address"
                        value={user.address} onChange={(e) => setUser({ ...user, address: e.target.value })} />
            </FormControl>

            <FormControl id="password" mb="1rem">
              <FormLabel> Password </FormLabel>
              <InputGroup>
                <Input type={showPwd.pass ? "text" : "password"} placeholder="Password" name="password" id="password"
                        value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={() => setShowPwd({...showPwd, pass: !showPwd.pass })}>
                      {showPwd.pass ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl id="confirmPassword" mb="1rem">
              <FormLabel> Confirm Password </FormLabel>
                <InputGroup>
                  <Input type={showPwd.confirmPass ? "text" : "password"} 
                          placeholder="Confirm Password" name="confirmPassword" id="confirmPassword"
                          value={user.confirmPassword} onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })} />
                  <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={() => setShowPwd({...showPwd, confirmPass: !showPwd.confirmPass })}>
                        {showPwd.confirmPass ? "Hide" : "Show"}
                      </Button>
                  </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id="role" mb="1rem">
              <FormLabel> Role </FormLabel>
              <Select name="role" id="role" 
                      value={user.role} onChange={(e) => setUser({ ...user, role: e.target.value })}>
                <option value="moderator"> Moderator </option>
                <option value="admin"> Admin </option>
              </Select>
            </FormControl>
          </Stack>
        </Box>

        </Box>

        <ButtonGroup mt="2rem" display="flex" flexDirection="row" justifyContent="center">
          <Button leftIcon={<AiOutlineUserAdd size="20" />} w="150px" colorScheme="blue" variant="solid" onClick={() => onCreate()}>
            New User
          </Button>
          <Button colorScheme="blue" variant="outline" onClick={() => backToUsers()}>
            Back to Products
          </Button>
        </ButtonGroup>
      </>
    );
  };
  const displayEditUser = (data) => {
    const { fullName, email, username, password, role } = data;

    return (
      <>
        <Box display="flex" flexDirection="row" justifyContent="center" >
        {displayUserDetails()}

        <Box border="1px" borderColor="gray.200" borderStyle="solid" p="1rem" borderRadius="md" width="500px" ml="1rem">
          <Heading as="h3" size="md" my="1rem" textAlign="left"> Edit User </Heading>

          <Stack>
            <FormControl id="fullName" mb="1rem">
              <FormLabel> Full Name </FormLabel>
              <Input type="text" placeholder="Full Name" name="fullName"
                  id="fullName" value={fullName ? fullName : user.fullName} onChange={(e) => setUser({ ...user, fullName: e.target.value })} />
            </FormControl>

            <FormControl id="username" mb="1rem">
              <FormLabel> Username </FormLabel>
              <Input type="text" placeholder="Username" name="username"
                  id="username" value={username ? username : user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} />
            </FormControl>

            <FormControl id="email" mb="1rem">
              <FormLabel> Email </FormLabel>
              <Input type="email" placeholder="Email" name="email"
                  id="email" value={email ? email : user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
            </FormControl>

            <FormControl id="password" mb="1rem">
              <FormLabel> Password </FormLabel>
              <Input type="password" placeholder="Password" name="password"
                  id="password" value={password ? password : user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
            </FormControl>

            <FormControl id="role" mb="1rem">
              <FormLabel> Role </FormLabel>
              <Select name="role" id="role" value={role ? role :user.role} onChange={(e) => setUser({ ...user, role: e.target.value })}>
                <option value="moderator"> Moderator </option>
                <option value="admin"> Admin </option>
              </Select>
            </FormControl>
          </Stack>
        </Box>

        </Box>

        <ButtonGroup mt="2rem" display="flex" flexDirection="row" justifyContent="center">
          <Button leftIcon={<AiOutlineUserAdd size="20" />} w="150px" colorScheme="blue" variant="solid" 
                  onClick={() => onEdit(action.data && action.data)}>
            Edit User
          </Button>
          <Button colorScheme="blue" variant="outline" onClick={() => backToUsers()}>
            Back to Products
          </Button>
        </ButtonGroup>
      </>
    );
  };
  const displayUsersFilter = () => {
    return (
      <Flex flexDirection="column" border="1px" borderColor="gray.200" borderStyle="solid" py="2rem" px="1rem" borderRadius="md" width="500px" my="2rem"
            justifyContent="center" mx="auto">
        <Heading as="h3" size="md" mb="1rem" textAlign="center"> Filter </Heading>

        <Flex flexDirection="row">
          <Input type="text" placeholder={`Filter by ${filter.filterType}`}
            value={filter.queryString} onChange={(e) => onFilter(e.target.value)} mr=".5rem" />

          <Select w="100px" placeholder="Role" value={filter.filterType} onChange={(e) => setFilter({ ...filter, filterType: e.target.value })}
                   ml=".5rem" >
            <option value="email"> Email </option>
            <option value="role"> Role </option>
          </Select>
        </Flex>
      </Flex>
    );
  };
  const displayUserDetails = () => {
    //  const { avatar, fullName, username, email, role, password } = data;

    return <Flex flexDirection="column" justifyContent="center" alignContent="center"> 
            <Box display="flex" flexDirection="row" mr="1rem" mb="3rem" justifyContent="center">
              <Flex flexDirection="column" p="1rem" w="20rem" mr="1rem"
                  border="1px" borderColor="gray.200" borderStyle="solid" borderRadius="md">

                <Heading as="h3" size="md" textAlign="left" my="1rem">
                  User Details
                </Heading>
                
                <Avatar name="Dan Abrahmov" src={user.avatar} mb="1.25rem" />

                <Box display="flex" flexDirection="row" my="1.25rem"> 
                    <BiUser size="20" />  
                    <Text ml=".5rem" fontStyle="italic"> fullName : </Text>
                    <Text ml=".5rem" fontWeight="bold"> {user.fullName} </Text>
                </Box>
                { action.value !== "create" && 
                  <Box display="flex" flexDirection="row" my="1.25rem"> 
                    <BiUser size="20" />  
                    <Text ml=".5rem" fontStyle="italic"> username : </Text>
                    <Text ml=".5rem" fontWeight="bold"> {user.username} </Text>
                  </Box>
                }
                <Box display="flex" flexDirection="row" my="1.25rem"> 
                    <FaEnvelope size="20" />  
                    <Text ml=".5rem" fontStyle="italic"> email : </Text>
                    <Text ml=".5rem" fontWeight="bold"> {user.email} </Text>
                </Box>

                <Box display="flex" flexDirection="row" my="1.25rem"> 
                    <MdPhoneIphone size="20" />  
                    <Text ml=".5rem" fontStyle="italic"> phone : </Text>
                    <Text ml=".5rem" fontWeight="bold"> {user.phone} </Text>
                </Box>

                <Box display="flex" flexDirection="row" my="1.25rem"> 
                    <FaTransgender size="20" />  
                    <Text ml=".5rem" fontStyle="italic"> gender : </Text>
                    <Text ml=".5rem" fontWeight="bold"> {user.gender} </Text>
                </Box>

                <Text display="flex" flexDirection="row" my="1.25rem"> 
                  <GoPrimitiveDot size="20" color={user.active ? "green" : "red"} /> active: 
                    <Text ml=".5rem" fontWeight="bold"> {user.active === "true" ? "active" : "inavtive"} </Text>
                </Text>

                <Box display="flex" flexDirection="row" my="1.25rem"> 
                    <MdLocationOn size="20" />  
                    <Text ml=".5rem" fontStyle="italic"> address : </Text>
                    <Text ml=".5rem" fontWeight="bold"> {user.address} </Text>
                </Box>

                <Box display="flex" flexDirection="row" my="1.25rem"> 
                    <FaUserLock size="20" />  
                    <Text ml=".5rem" fontStyle="italic"> password : </Text>
                    <Text ml=".5rem" fontWeight="bold"> {hidePassword(user.password)} </Text>
                </Box>

                <Box display="flex" flexDirection="row" my="1.25rem"> 
                    <GiRank3 size="20" />  
                    <Text ml=".5rem" fontStyle="italic"> role : </Text>
                    <Text ml=".5rem" fontWeight="bold"> {user.role} </Text>
                </Box>
              </Flex>
            
              { action.value === "details" &&
                <Stack display="flex" flexDirection="column" p="1rem" w="20rem" ml="1rem"
                      border="1px" borderColor="gray.200" borderStyle="solid" borderRadius="md">

                    <Heading as="h4" size="md" textAlign="center" my="1rem">
                        USER ACTIONS
                    </Heading>
              
                  <ButtonGroup variant="outline" colorScheme="blue" spacing="6" display={"flex"} flexDirection="column" 
                              justifyContent="center" alignItems="center" >
                    <Button colorScheme="blue" my=".25rem"
                            onClick={() =>  setAction({ value: "edit", 
                                                          data: {userId: user._id, userIndex: action.data}
                                                        })}>
                            Edit
                    </Button>

                    <Button colorScheme="blue" aria-label="delete user" my=".25rem" ml="0" icon={<BiTrash />} 
                            onClick={() => { 
                              setAction({ 
                                    data: { text: "Are you sure to delete this User ?", 
                                    action: () => onDelete(user._id, action.data), 
                                    label: "Delete" } 
                                    }); 
                              onOpen()
                              }
                              }>
                                Delete
                    </Button>
                                
                    <Button colorScheme="blue" aria-label="block user" my=".25rem" icon={<BiBlock />} 
                            onClick={() => { 
                              setAction({ 
                                    data: { text: "Are you sure to block this user ?", 
                                    action: () => onDelete(user._id, action.data), 
                                    label: "Block" } 
                                    }); 
                              onOpen()
                              }
                              }>
                            Block
                    </Button>
                  </ButtonGroup>
                </Stack>
                }  
            </Box>

          { action.value === "details" && 
            <Button colorScheme="blue" variant="outline" w="120px" mx="auto" onClick={() =>  backToUsers()}>
                Back to Users
            </Button>
          }
          </Flex>
  };
  
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
    <NavBar />
    <Box p="1rem">
      <Flex flexDirection="column" width="100wh">
            <Heading as="h2" size="md" textAlign="left" my="2rem"> User Managment </Heading>

            {
              action.value === "create" ? displayAddUser() :

              action.value === "edit" ? Object.keys(user).length > 0 && displayEditUser(user) :

              action.value === "details" ? displayUserDetails() :

              action.value === "users" ? 
                  <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                    <Button colorScheme="blue" onClick={() => setAction({value: "create"})} w="100px"> Create </Button>

                    {displayUsersFilter()}
                    
                    { loading ? 
                      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="lg" /> : 
                      users.length > 0 ? displayUsersList(users) :
                      <Heading as="h4" size="md" textAlign="center"> There is not any User </Heading>
                    }
                  </Box> : ""
            }
                
            { action.data && displayModal(action.data && action.data) }         
      </Flex>      
    </Box>
    </>
  );
};

export default Users;