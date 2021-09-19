import React, { useState, useEffect } from "react";
import { BiBlock, BiTrash, BiPencil, BiDetail, BiUser } from "react-icons/bi"
import { AiOutlineUserAdd } from "react-icons/ai"
import { FormControl, FormLabel, Input, Select, Checkbox, Text, Heading, Radio, RadioGroup, Textarea,
  Spinner,
  Table, Thead, Tbody, Tfoot, Tr, Th, Td,
  useToast, useDisclosure,
  Flex, Stack, Box, 
  Avatar,
  Button, ButtonGroup, IconButton,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, 
  Image,
  InputRightElement, InputGroup,
  Menu, MenuList, MenuItem, MenuButton,
  Portal, Container
   } from "@chakra-ui/react"
import { FaCog, FaChevronDown, FaTransgender, FaUserLock, FaEnvelope } from "react-icons/fa";
import { MdLocationOn, MdPhoneIphone } from "react-icons/md"
import { GoPrimitiveDot } from "react-icons/go" 
import { GiRank3 } from "react-icons/gi"
import { FaEllipsisV } from "react-icons/fa";

import Layout from "../Layout.jsx"
import { load_users, create_user, filter_user, block_user, delete_user, edit_user } from "../../api"
import { View } from "../../Components"

const COLORS = {
  notif: {
    success: "#38A169",
    error: "#E53E3E",
    info: "#3182ce",
    warning: "#D69E2E",
    secondary: "#718096",
    black: "#000000cc"
  },
};

const proxy = "http://localhost:5000"

const Users = () => {
  const [user, setUser] = useState({ 
      fullName: "", username: "", phone: "", address: "", active: "false", gender: "male", email: "", password: "", confirmPassword: "", role: "moderator" 
    });
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState({ queryString: "", filterType: "role" });
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState({ value: "users", data: null })
  const [showPwd, setShowPwd] = useState({ pass: false, confirmPass: false });

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()

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
      data: { text: "Are you sure to block this user ?", 
      action: () => onBlock(userId, userIndex), label: "Block" }
    }); 
    onOpen()
  };
  const detailsUser = (userData, userIndex) => {
    setAction({ value: "details", data:{ productIndex: userIndex } })
    setUser(userData)
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

  // API calls
  const uploadImage = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const url = `${proxy}/users/uploadfiles`;

    if (
      e.currentTarget &&
      e.currentTarget.files &&
      e.currentTarget.files.length > 0
    ) {
      const file = e.currentTarget.files[0];

      let formData = new FormData();
      const config = {
        header: { "content-type": "multipart/form-data" }
      };
      formData.append("file", file);

      fetch(url, formData, config)
      .then((res) => {
        if (res.data.success) {
          setUser({...user, avatar: `/uploads/${res.data.fileName}` })
          return displayToast({ msg: 'Upload success: ', status: "success" })
        } else {
          return displayToast({ msg: 'Failed to Upload !', status: "error" })
        }
      })
      .catch((err) => displayToast({ msg: err.message, status: "error" }))
    }
  };
  const onLoad = async () => {
    setLoading(true);
    const result = await load_users();
    if (result.success) {
      setLoading(false);
      setUsers(result.data);
      return;
    }
    displayToast({msg: "an Error occured while loading users !", status: "error"})
  };
  const onCreate = async () => {
    if (user.password !== user.confirmPassword) {
      displayToast({msg: "password & confirm password do not match !", status: "error"})
      return; 
    }
    delete user.confirmPassword

      // data validation (yup)
      const result = await create_user(user); 

      if (result.success) {
        const data = result.data;
        // update state
        displayToast({msg: result.message, status: "success"})
        return;
      }
      displayToast({msg: "an Error occured while adding a user !", status: "error"})
  };
  const onEdit = async () => {
    let userId, userIndex; 
    if(action.value === "edit") {
       userId = action.data.userId
      //  userIndex = action.data.userIndex
    }

    // data validation
    let editedUser = user;
    // remove password from obj if do not change
    if (editedUser.password === "") {
      delete editedUser.password;
      delete editedUser.confirmPassword;
    }

    const result = await edit_user(userId, editedUser);

    if (result.success) {
      // update state
      displayToast({msg: result.message, status: "success"})
      return;
    }
    displayToast({msg: "an Error occured during user edition !", status: "error"})
  };
  const onDelete = async (userId) => {
    const result = await delete_user(userId);

    if (result.success) {
      // update stat
      displayToast({msg: result.message, status: "success"})
      return;
    }
    displayToast({msg: "an Error occured while deleting user !", status: "error"})
  };
  const onBlock = async (userId, userIndex) => {
    const result = await block_user(userId, { active: !users[userIndex].active })
    
    if (result.success) {
      // update state
      displayToast({ msg: result.message, status: "succes" })
      return;
    }
    displayToast({msg: "an Error occured while blocking user !", status: "error"})
  };
  const onFilter = async (value) => {
    setFilter({ ...filter, queryString: value });
    setLoading(true);

    const result = await filter_user(value, filter.filterType);

    if (result.success) {
      // update state
      setUsers(result.data);
      setLoading(false);
      return;
    }
    setLoading(false);
    displayToast({msg: "an Error occured while filtering users !", status: "error"})
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
            <Input type="file" id="file" onChange={(e) => uploadImage(e)} value={user.avatar} />

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
          <Button leftIcon={<AiOutlineUserAdd size="20" />} colorScheme="blue" variant="solid" w="10rem" onClick={() => onCreate()}>
            New User
          </Button>
          <Button colorScheme="blue" variant="outline" w="10rem" onClick={() => backToUsers()}>
            Back to Users
          </Button>
        </ButtonGroup>
      </>
    );
  };
  const displayEditUser = (data) => {
    const { fullName, email, username, password, role, address, active, gender, phone, avatar } = data;

    return (
      <>
        <Box display="flex" flexDirection="row" justifyContent="center" >
        {displayUserDetails()}

          <Box border="1px" borderColor="gray.200" borderStyle="solid" p="1rem" borderRadius="md" width="500px" ml="1rem">
            <Heading as="h3" size="md" my="1rem" textAlign="left"> Edit User </Heading>

            <Stack>
            <Image boxSize="150px" borderRadius="md" mb="1rem" mr="auto" alt={user.username} fallbackSrc="https://via.placeholder.com/150"
                      src={avatar ? avatar : user.avatar} />
              <Input type="file" id="file" onChange={(e) => uploadImage(e)} value={user.avatar} />

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

              <FormControl id="phone" mb="1rem">
                <FormLabel> Phone </FormLabel>
                <Input type="text" placeholder="Phone" name="phone"
                    id="phone" value={phone ? phone : user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} />
              </FormControl>

              <FormControl id="phone" mb="1rem">
                <FormLabel> gender </FormLabel> 
                <RadioGroup id="gender" name="gender" value={gender ? gender :user.gender}
                            onChange={(e) => setUser({ ...user, gender: e })}>
                  <Stack direction="row">
                    <Radio value="male"> Male </Radio>
                    <Radio value="female"> Female </Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl id="active" mb="1rem">
                <FormLabel> Active </FormLabel>
                <RadioGroup id="active" name="active" value={active ? active : user.active}
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
                          value={address ? address : user.address} onChange={(e) => setUser({ ...user, address: e.target.value })} />
              </FormControl>

              <FormControl FormControl id="password" mb="1rem">
                <FormLabel> Password </FormLabel>
                <InputGroup>
                  <Input type={showPwd.pass ? "text" : "password"} placeholder="Password" name="password" id="password"
                          value={password ? password :user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
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
            Back to Users
          </Button>
        </ButtonGroup>
      </>
    );
  };
  // avant de l'a supprimer faudra faire (edit / add)
  const displayUserDetails = () => {
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
                  <GoPrimitiveDot size="20" color={user.active === "true" ? COLORS.notif.success : COLORS.notif.error} /> active: 
                    <Text ml=".5rem" fontWeight="bold"> {user.active === "true" ? "active" : "inactive"} </Text>
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
              
                  <ButtonGroup variant="outline" display={"flex"} flexDirection="column" 
                              justifyContent="center" alignItems="center">
                    <Button rightIcon={<BiPencil size="18" />} colorScheme="yellow" mb="1rem" w="7rem"
                            onClick={() =>  setAction({ value: "edit", 
                                                          data: {userId: user._id, userIndex: action.data}
                                                        })}>
                            Edit
                    </Button>

                    <Button rightIcon={<BiTrash size="18" />} colorScheme="red" mb="1rem" w="7rem"
                            onClick={() => deleteUser(user._id, action.data)}>
                                Delete
                    </Button>
                                
                    <Button rightIcon={<BiBlock size="18" />} colorScheme="gray" mb="1rem" w="7rem"
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
    onLoad();
  }, []);

  return (
    <Layout isFixedNav isVisible>
      <Container maxW="80em" py="39px" px={["16px","","","40px"]} m="0 auto" borderRadius="4px">
          <Heading as="h2" size="lg" textAlign="left" my="2rem"> Users Management </Heading>

          <View if={action.value === "create"}>
            { displayAddUser() }
          </View>

          <View if={action.value === "edit" && Object.keys(user).length > 0 }>
            { displayEditUser(user) }
          </View>

          <View if={action.value === "details"}>
            <UserDetails backToUsers={backToUsers} deleteUser={deleteUser} onDelete={onDelete} onOpen={onOpen} hidePassword={hidePassword}
                  user={user} action={action} setAction={setAction} />
          </View>

          <View if={action.value === "users"}>
            <Flex flexDirection="column" justifyContent="center" alignItems="center">
                <Button colorScheme="blue" variant="outline" w="6rem" alignSelf="flex-end" rightIcon={<AiOutlineUserAdd size="20" />} 
                        onClick={() => setAction({value: "create"})}> Create </Button>

                <UserFilter filter={filter} onFilter={onFilter} setFilter={setFilter} />
                
                { loading ? 
                    <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="lg" /> : 
                      users.length > 0 ? 
                        <UsersList users={users} usersOnChange={usersOnChange} convertDate={convertDate} editUser={editUser} deleteUser={deleteUser} blockUser={blockUser} detailsUser={detailsUser} /> :
                          <Heading as="h4" size="md" textAlign="center"> There is not any User </Heading>
                }
            </Flex>
          </View>
         
          <View if={action.data}>
            <ModalBox data={action.data} isOpen={isOpen} onClose={onClose} />
          </View>
      </Container>   
    </Layout>
  );
};

const ModalBox = ({ data, isOpen, onClose }) => {
  const { text, action, label } = data
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader> { label && label } </ModalHeader>
        <ModalCloseButton />
        <ModalBody> { text && text } </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={action && action}>
            { label && label }
          </Button>
          <Button variant="outiline" colorScheme="blue" onClick={() => onClose()}> Cancel </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
};

const UserDetails = ({ backToUsers, deleteUser, onDelete, onOpen, hidePassword, user, action, setAction }) => {
  return <Flex flexDirection="column" justifyContent="center" alignContent="center"> 
          <Flex mr="1rem" mb="3rem" justifyContent="center">
            <Flex flexDirection="column" p="1rem" w="20rem" mr="1rem"
                border="1px" borderColor="gray.200" borderStyle="solid" borderRadius="md">

              <Heading as="h3" size="md" textAlign="left" my="1rem">
                User Details
              </Heading>
              
              <Avatar name="Dan Abrahmov" src={user.avatar} mb="1.25rem" />

              <Flex my="1.25rem"> 
                  <BiUser size="20" />  
                  <Text ml=".5rem" fontStyle="italic"> fullName : </Text>
                  <Text ml=".5rem" fontWeight="bold"> {user.fullName} </Text>
              </Flex>

              <View if={action.value !== "create"}>
                <Flex my="1.25rem"> 
                  <BiUser size="20" />  
                  <Text ml=".5rem" fontStyle="italic"> username : </Text>
                  <Text ml=".5rem" fontWeight="bold"> {user.username} </Text>
                </Flex>
              </View>

              <Flex my="1.25rem"> 
                  <FaEnvelope size="20" />  
                  <Text ml=".5rem" fontStyle="italic"> email : </Text>
                  <Text ml=".5rem" fontWeight="bold"> {user.email} </Text>
              </Flex>

              <Flex my="1.25rem"> 
                  <MdPhoneIphone size="20" />  
                  <Text ml=".5rem" fontStyle="italic"> phone : </Text>
                  <Text ml=".5rem" fontWeight="bold"> {user.phone} </Text>
              </Flex>

              <Box display="flex" flexDirection="row" my="1.25rem"> 
                  <FaTransgender size="20" />  
                  <Text ml=".5rem" fontStyle="italic"> gender : </Text>
                  <Text ml=".5rem" fontWeight="bold"> {user.gender} </Text>
              </Box>

              <Text display="flex" flexDirection="row" my="1.25rem"> 
                <GoPrimitiveDot size="20" color={user.active === "true" ? COLORS.notif.success : COLORS.notif.error} /> active: 
                  <Text ml=".5rem" fontWeight="bold"> {user.active === "true" ? "active" : "inactive"} </Text>
              </Text>

              <Flex my="1.25rem"> 
                  <MdLocationOn size="20" />  
                  <Text ml=".5rem" fontStyle="italic"> address : </Text>
                  <Text ml=".5rem" fontWeight="bold"> {user.address} </Text>
              </Flex>

              <Flex my="1.25rem"> 
                  <FaUserLock size="20" />  
                  <Text ml=".5rem" fontStyle="italic"> password : </Text>
                  <Text ml=".5rem" fontWeight="bold"> {hidePassword(user.password)} </Text>
              </Flex>

              <Flex my="1.25rem"> 
                  <GiRank3 size="20" />  
                  <Text ml=".5rem" fontStyle="italic"> role : </Text>
                  <Text ml=".5rem" fontWeight="bold"> {user.role} </Text>
              </Flex>
            </Flex>
          
    
            <View if={action.value === "details"}>
              <Flex flexDirection="column" p="1rem" w="20rem" ml="1rem"
                    border="1px" borderColor="gray.200" borderStyle="solid" borderRadius="md">

                  <Heading as="h4" size="md" textAlign="center" my="1rem">
                      USER ACTIONS
                  </Heading>
            
                <ButtonGroup variant="outline" display={"flex"} flexDirection="column" 
                            justifyContent="center" alignItems="center">
                  <Button rightIcon={<BiPencil size="18" />} colorScheme="yellow" mb="1rem" w="7rem"
                          onClick={() =>  setAction({ value: "edit", 
                                                        data: {userId: user._id, userIndex: action.data}
                                                      })}>
                          Edit
                  </Button>

                  <Button rightIcon={<BiTrash size="18" />} colorScheme="red" mb="1rem" w="7rem"
                          onClick={() => deleteUser(user._id, action.data)}>
                              Delete
                  </Button>
                              
                  <Button rightIcon={<BiBlock size="18" />} colorScheme="gray" mb="1rem" w="7rem"
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
              </Flex>
            </View> 
          </Flex> 

          <View if={action.value === "details"}>
            <Button colorScheme="blue" variant="outline" w="120px" mx="auto" onClick={() => backToUsers()}>
                  Back to Users
            </Button>
          </View>
        </Flex>
};

const UserFilter = ({ filter, onFilter, setFilter }) => {
  return (
    <Flex flexDirection="column" border="1px" borderColor="gray.200" borderStyle="solid" py="2rem" px="1rem" borderRadius="md" width="500px"  my="2rem" justifyContent="center" mx="auto">
      <Heading as="h3" size="md" mb="1rem" textAlign="center"> Users Filter </Heading>

      <Flex>
        <Input type="text" placeholder={`Filter by ${filter.filterType}`}
              value={filter.queryString} onChange={(e) => onFilter(e.target.value)} mr=".5rem" />

        <Select w="8rem" value={filter.filterType} onChange={(e) => setFilter({ ...filter, filterType: e.target.value })}
                 ml=".5rem" >
          <option value="email"> Email </option>
          <option value="role"> Role </option>
        </Select>
      </Flex>
    </Flex>
  );
};

const UsersList = ({ users, usersOnChange, convertDate, editUser, deleteUser, blockUser, detailsUser }) => {
     
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
            <Td  p="1rem">
              <Checkbox colorScheme="blue" size="md" defaultIsChecked={false}></Checkbox>
            </Td>
            <Td  p="1rem">
              <Input type="email" placeholder="Email" name="email"
                    id={el._id} value={el.email} onChange={e => usersOnChange(e)} />
            </Td>
            <Td  p="1rem">
              <Input type="password" placeholder="Password" name="password"
                    id={el._id} value={el.password} onChange={e => usersOnChange(e)} />
            </Td>
            <Td  p="1rem">
                <Select id={el._id} value={el.role} onChange={e => usersOnChange(e)}>
                  <option value="moderator"> Moderator </option>
                  <option value="admin"> Admin </option>
                </Select>
            </Td>
            <Td  p="1rem"> 
              {/* { displaySubMenu(el._id, idx, el) } */}
              <SubMenu  userId={el._id} userIndex={idx} userData={el} editUser={editUser} deleteUser={deleteUser} blockUser={blockUser} detailsUser={detailsUser} />
            </Td>
            <Td  p="1rem"> {el.createdAt && convertDate(el.createdAt)} </Td>
            <Td p="1rem"> {el.editedAt ? convertDate(el.editedAt) : "not updated "} </Td>
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

const SubMenu = ({ userId, userIndex, userData, editUser, deleteUser, blockUser, detailsUser }) => {
  return <Menu>
          <MenuButton as={IconButton}
            icon={<FaEllipsisV />}>
          </MenuButton>

          <MenuList>
            <MenuItem color={COLORS.notif.warning}
                  icon={<BiPencil size="18" color={COLORS.notif.warning} />} 
                  onClick={() => editUser(userId, userIndex, userData)}> Edit </MenuItem>

            <MenuItem color={COLORS.notif.error}
                  icon={<BiTrash size="18" color={COLORS.notif.error} />} 
                  onClick={() => deleteUser(userId, userIndex)}> Delete </MenuItem>
            <MenuItem color={COLORS.notif.secondary}
                  icon={<BiBlock size="18" color={COLORS.notif.secondary} />} 
                  onClick={() => blockUser(userId, userIndex)}> Block </MenuItem>

            <MenuItem color={COLORS.notif.black}
                  icon={<BiDetail size="18" color={COLORS.notif.black} />} 
                  onClick={() => detailsUser(userData)}> Details </MenuItem>
          </MenuList>
        </Menu>
};



export default Users;