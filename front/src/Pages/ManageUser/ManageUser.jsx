import React, { useState, useEffect } from "react";
import { BiBlock, BiTrash, BiPencil, BiDetail, BiUser } from "react-icons/bi"
import { AiOutlineUserAdd } from "react-icons/ai"
import { FormControl, FormLabel, Input, Select, Checkbox, Text, Heading,
  Spinner,
  Table, Thead, Tbody, Tfoot, Tr, Th, Td,
  useToast,
  Flex, Stack, Box, 
  Avatar,
  Button, ButtonGroup, IconButton,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure,
  Link 
   } from "@chakra-ui/react"


// import TopBar from "../../Components/TopBar/TopBar"
// import SideBar from "../../Components/SideBar/SideBar"

const SideBar = () => {

  return  <>
            <Flex flexDirection="column" justifyContent="center">
              <>
                <Link href="/home" display="flex" flexDirection="row" fontSize="15" justifyContent="center"
                      mb=".5rem" p="1rem" borderRadius="md" w="200px" bg="gray.300"> 
                  <AiOutlineUserAdd size="18" />
                  App Statistics
                </Link>
                <Link to="/manageUser" display="flex" flexDirection="row" fontSize="15" justifyContent="center"
                      mb=".5rem" p="1rem" borderRadius="md" w="200px" bg="gray.300"> 
                  <AiOutlineUserAdd size="18" />
                  User Manamgement 
                </Link>

                <Link to="/products" display="flex" flexDirection="row" fontSize="15" justifyContent="center"
                      mb=".5rem" p="1rem" borderRadius="md" w="200px" bg="gray.300"> 
                < AiOutlineUserAdd size="18" />
                  Product Manamgement
                </Link>

                <Link to="/writeNewsletter" display="flex" flexDirection="row" fontSize="15" justifyContent="center"
                      mb=".5rem" p="1rem" borderRadius="md" w="200px" bg="gray.300"> 
                  <AiOutlineUserAdd size="18" />
                  Write Newsletter
                </Link>
              </>
            </Flex>
          </>
}

const ManageUser = () => {
  const [user, setUser] = useState({ fullName: "", username: "", email: "", password: "", role: "" });
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
      dsiplayToast({msg: "an Error occured while loading users !", status: "error"})

    } catch (err) {
      dsiplayToast({msg: `Error: ${err.message}`, status: "error"})
    }
  };
  const onCreate = async () => {
    // e.preventDefault();
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
        dsiplayToast({msg: result.message, status: "success"})
        return;
      }
      dsiplayToast({msg: "an Error occured while adding a user !", status: "error"})

    } catch (err) {
      dsiplayToast({msg: `Error: ${err.message}`, status: "error"})
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
        dsiplayToast({msg: result.message, status: "success"})
        return;
      }
      dsiplayToast({msg: "an Error occured during user edition !", status: "error"})
    } catch (err) {
      dsiplayToast({msg: `Error: ${err.message}`, status: "error"})
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

        dsiplayToast({msg: result.message, status: "success"})
        return;
      }
      dsiplayToast({msg: "an Error occured while deleting user !", status: "error"})

    } catch (err) {
      dsiplayToast({msg: `Error: ${err.message}`, status: "error"})
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
        dsiplayToast({msg: result.message, status: "succes"})
        return;
      }
      dsiplayToast({msg: "an Error occured while blocking user !", status: "error"})

    } catch (err) {
      dsiplayToast({msg: `Error: ${err.message}`, status: "error"})
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
  const dsiplayToast = (data) => {
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
                <ButtonGroup variant="outline" colorScheme="blue" spacing="6" display={"flex"} flexDirection="column" 
                            justifyContent="center" alignItems="center" >
                  <IconButton colorScheme="blue" aria-label="edit user" my=".25rem" icon={<BiPencil />} 
                          onClick={() =>  {setAction({ value: "edit", data: {userId: el._id, userIndex: idx}}); setUser(el)}} />

                  <IconButton colorScheme="blue" aria-label="delete user" my=".25rem" ml="0" icon={<BiTrash />} 
                          onClick={() => { 
                              setAction({ data: { text: "Are you sure to delete this user ?", action: () => onDelete(el._id, idx), label: "Delete" } }); 
                              onOpen()}
                              } />
                              
                  <IconButton colorScheme="blue" aria-label="block user" my=".25rem" icon={<BiBlock />} 
                        onClick={() => { 
                          setAction({ data: { text: "Are you sure to delete this user ?", action: () => onBlock(el._id, idx), label: "Block" }}); 
                          onOpen()}
                          } />

                  <IconButton colorScheme="blue" aria-label="details user" my=".25rem" icon={<BiDetail />}
                          onClick={() => { setAction({ value: "details" }); setUser(el) }} />
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

            <FormControl id="password" mb="1rem">
              <FormLabel> Password </FormLabel>
              <Input type="password" placeholder="Password" name="password"
                  id="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
            </FormControl>

            <FormControl id="role" mb="1rem">
              <FormLabel> Role </FormLabel>
              <Select name="role" id="role" value={user.role} onChange={(e) => setUser({ ...user, role: e.target.value })}>
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
    const { name, description, price, features } = data;

    return (
      <form action="POST" className="add-user-form">
        <div className="form-input">
          <label htmlFor="name"> Name </label>
          <input
            type="text"
            placeholder="Name"
            value={name ? name : user.name}
            name="name"
            id="name"
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </div>

        <div className="form-input">
          <label htmlFor="description"> Description </label>
          <textarea name="description" id="description" placeholder="description" 
                    value={description ? description : user.description} 
                    onChange={e => setUser({ ...user, description: e.target.value })}>
          </textarea>
        </div>

        <div className="form-input">
          <label htmlFor="price"> Price </label>
          <input
            type="number"
            placeholder="Price"
            value={price ? price : user.price}
            name="price"
            id="price"
            onChange={(e) => setUser({ ...user, price: e.target.value })}
          />
        </div>

        <div className="form-input">
          <label htmlFor="features"> Features </label>
          <input
            type="text"
            placeholder="Add feature"
            value={features && features.length > 0 ? features : user.features}
            name="features"
            id="features"
            onChange={(e) => setUser({ ...user, features: e.target.value })}
          />
        </div>

        <div className="group-btn">
          <button type="submit" className="btn btn-accent" onClick={e => onEdit(e, action.data && action.data)}>
            Edit User
          </button>
          <button type="submit" className="btn btn-outline-accent" onClick={() => backToUsers()}>
            Back to Users
        </button>
        </div>
      </form>
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

    return <Box display="flex" flexDirection="row" mr="1rem">
            <Flex flexDirection="column" p="1rem" w="20rem"
                border="1px" borderColor="gray.200" borderStyle="solid" borderRadius="md">

              <Heading as="h3" size="md" textAlign="left" my="1rem">
                User Details
              </Heading>

              <Avatar name="Dan Abrahmov" src={user.avatar} mb="1.25rem" />
              <Text display="flex" flexDirection="row" my="1.25rem"> <BiUser size="20" /> full name : {user.fullName} </Text>
              { action.value !== "create" && 
                <Text display="flex" flexDirection="row" my="1.25rem"><BiUser size="20" /> username : {user.username} </Text> 
              }
              <Text display="flex" flexDirection="row" my="1.25rem"> <BiUser size="20" /> email: {user.email} </Text>
              <Text display="flex" flexDirection="row" my="1.25rem"> <BiUser size="20" /> password: {hidePassword(user.password)} </Text>
              <Text display="flex" flexDirection="row" my="1.25rem"> <BiUser size="20" /> role: {user.role} </Text>
            </Flex>

            <Heading as="h4" size="md" textAlign="center" my="1rem">
                All Users Actions
            </Heading>
            
            { action.value === "details" &&
              <ButtonGroup variant="outline" colorScheme="blue" spacing="6" display={"flex"} flexDirection="column" 
                          justifyContent="center" alignItems="center" >
                {/* <Button colorScheme="blue" my=".25rem"
                        onClick={() =>  {setAction({ value: "edit", data: {userId: el._id, userIndex: idx}}); setUser(el)}}>
                        Edit
                </Button>

                <Button colorScheme="blue" aria-label="delete user" my=".25rem" ml="0" icon={<BiTrash />} 
                        onClick={() => { 
                            setAction({ data: { text: "Are you sure to delete this user ?", action: () => onDelete(el._id, idx), label: "Delete" } }); 
                            onOpen()}
                            }>
                            Delete
                </Button>
                            
                <Button colorScheme="blue" aria-label="block user" my=".25rem" icon={<BiBlock />} 
                        onClick={() => { 
                          setAction({ data: { text: "Are you sure to delete this user ?", action: () => onBlock(el._id, idx), label: "Block" }}); 
                          onOpen()}
                          }>
                        Block
                </Button> */}
              </ButtonGroup>
            }

              <Button colorScheme="blue" variant="outline" aria-label="details user" my=".25rem" onClick={() => { backToUsers() }}>
                Back to Users
              </Button>            
          </Box>
  };
  
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
    {/* <TopBar /> */}
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
    <SideBar />
    </>
  );
};

export default ManageUser;