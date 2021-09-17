import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { BiBlock, BiTrash, BiPencil, BiDetail, BiUser } from "react-icons/bi"
import { BsReplyFill, BsFillEyeSlashFill, BsCheckBox } from "react-icons/bs"
import { FormControl, FormLabel, Input, Select, Checkbox, Text, Heading, Radio, RadioGroup, Textarea,
  Spinner,
  useToast, useDisclosure,
  Flex, Stack, Box, 
  Avatar,
  Button, ButtonGroup, IconButton,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, 
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  Portal, Container
   } from "@chakra-ui/react";

import Layout from "./Layout.jsx"

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

const Contacts = () => {
  const [contact, setContact] = useState({ message: "", status: "unchecked" });
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState({ queryString: "", filterStatus: "unchecked", filterType: "", filterDate: "all" });
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState({ value: "contacts", data: null })

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const authStore = useSelector(state => state.auth);

  // Functions
  const convertDate = (date) => {
    const new_date = new Date(date).toLocaleDateString("en-US").split(/:| /)[0];
    return new_date;
  };
  const backToContacts = () => {
    setAction({ value: "contacs" })
    setContact({ message: "", status: "unchecked" })
  };

  const hideContact = (contactId, contactIndex) => {
    setAction({ 
      data: { text: "Are you sure to Hide this Contact ?", 
              action: () => onHide(contactId, contactIndex), label: "Hide" } 
    }); 
    onOpen()
  };
  const replyContact = (contactId, contactIndex, userId) => {
    // opens a modal box (message)
    setAction({ data: { action: () => onReply(contactId, contactIndex, userId), label: "reply" } });
    onOpen()
  };
  const checkContact = (contactId, contactIndex) => {
    setAction({ 
      data: { text: "Are you sure to Check mark this Contact ?", 
              action: () => onCheck(contactId, contactIndex), label: "Check" } 
    }); 
    onOpen()
  };

  // API calls
  const getContacts = async () => {
    setLoading(true);
    try {
      const url = `${proxy}/admin/contacts/getContacts`;
      const res = await fetch(url);

      if (res.ok) {
        const result = await res.json();
        setLoading(false);
        setContacts(result.data);
        return;
      }
      displayToast({msg: "an Error occured while loading contacts !", status: "error"})

    } catch (err) {
      displayToast({msg: `Error: ${err.message}`, status: "error"})
    }
  };
  const onHide = async (contactId, contactIndex) => {
    const url = `${proxy}/admin/contacts/hide/${contactId}`

    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "applicaion/json"
        },
        method: "PUT",
        body: JSON.stringify({ status: "hidden"})
      })

      if (res.ok) {
        const result = await res.json()
        console.log(result.data)
        // update state after edit op
        displayToast({ msg: result.message, status: "success" })
        return;
      }
      displayToast({ msg: "an Error occured while hiding the client message !", status: "error" })

    } catch (err) {
      displayToast({ msg: err.message, status: "error" })
    }
  };
  const onCheck = async (contactId, contactIndex) => {
    const url = `${proxy}/admin/contacts/check/${contactId}`

    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "applicaion/json"
        },
        method: "PUT",
        body: { status: "checked"}
      })

      if (res.ok) {
        const result = await res.json()
        console.log(result.data)
        // update state after edit op
        displayToast({ msg: result.message, status: "success" })
        return;
      }
      displayToast({ msg: "an Error occured while checking up the client message !", status: "error" })

    } catch (err) {
      displayToast({ msg: err.message, status: "error" })
    }
  };
  const onReply = async (contactId, contactIndex, userId) => {
    const url = `${proxy}/admin/contacts/reply/${contactId}`
    contact.responseTo = 
    contact.authorId = authStore.userData._id;

    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "applicaion/json"
        },
        method: "POST",
        body: JSON.stringify(contact)
      })

      if (res.ok) {
        const result = await res.json()
        console.log(result.data)
        // update state after edit op
        displayToast({ msg: result.message, status: "success" })
        return;
      }
      displayToast({ msg: "an Error occured while repling to client !", status: "error" })

    } catch (err) {
      displayToast({ msg: err.message, status: "error" })
    }
  };
  const onFilter = async (value) => {
    setFilter({ ...filter, queryString: value });
    setLoading(true);

    try {
      const url = `${proxy}/admin/contacts/filterUsers?queryString=${value}&filterStatus=${filter.filterStatus}`;
      const res = await fetch(url);

      if (res.ok) {
        const result = await res.json();
        console.log('contacts: ', result.data)
        // setUsers(result.data);
        setLoading(false);
        return;
      }
      displayToast({ msg:"an Error occured while filtering contacts !", status: "error" })

    } catch (err) {
      displayToast({ msg: err.message, status: "error" })
    }
  };

  // Components
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
    
    const closeModal = () => {
      backToContacts(); 
      onClose();
    };

    return  <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader> { label && label } </ModalHeader>
                <ModalCloseButton />
                <ModalBody> 
                { label === "reply" ? 
                  <Textarea placeholder="Reply message ..." size="md" isRequired variant="filled"
                            value={contact.message} onChange={(e) => setContact({...contact, message: e.target.value})} /> :
                  text && text
                }
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={action && action}>
                    { label && label }
                  </Button>
                  <Button variant="outiline" colorScheme="blue" onClick={() => closeModal()}> Cancel </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
  };
  const displayContactsFilter = () => {
    return (
      <Flex flexDirection="column" border="1px" borderColor="gray.200" borderStyle="solid" py="2rem" px="1rem" borderRadius="md" width="500px"  my="2rem" justifyContent="center" mx="auto">
        <Heading as="h3" size="md" mb="1rem" textAlign="center"> Contacts Filter </Heading>

        <Flex flexDirection="column-reverse">
          <Input type="text" placeholder={`Filter by ${filter.filterType}`}
                value={filter.queryString} onChange={(e) => onFilter(e.target.value)} mr=".5rem" />

          <Flex flexDir="row" justifyContent="center" mb="1rem">
            <Select w="8rem" value={filter.filterStatus} onChange={(e) => setFilter({ ...filter, filterStatus: e.target.value })}
                    ml=".5rem" >
                <option value="checked"> Checked </option>
                <option value="hide"> Hide </option>
            </Select>

            <Select w="8rem" value={filter.filterType} onChange={(e) => setFilter({ ...filter, filterType: e.target.value })}
                    ml=".5rem" >
                <option value="subject"> Subject </option>
                <option value="email"> Email </option>
            </Select>

            <Select w="8rem" value={filter.filterDate} onChange={(e) => setFilter({ ...filter, filterDate: e.target.value })}
                    ml=".5rem" >
                <option value="recent"> Most Recent </option>
                <option value="all"> All </option>
          </Select>
          </Flex>
        </Flex>
      </Flex>
    );
  };
  const displayContacts = (data) => {
    return  <Box w="45rem" p="1rem" mb="1rem" border="1px" borderColor="gray.200" borderStyle="solid" borderRadius="md"
                  boxShadow="md">
            
            <Text my="1rem"> Query:  </Text>
              {  data.map((el, idx) =>
                      <Accordion allowToggle allowMultiple>
                        <AccordionItem>
                            <AccordionButton>
                              <Box display="flex" flexDirection="row" justifyContent="space-between" flex="1">
                                { el.avatar ? 
                                    <Avatar name={el.username && el.username} src={el.avatar} size="sm" /> :
                                    <Avatar name={el.username && el.username} src={el.avatar} size="md" /> 
                                }
                                <Text my="auto"> { el.subject && el.subject } </Text>
                                <Text my="auto" fontWeight="medium"> { el.status && el.status } </Text>

                                <Text my="auto" mr="1rem"  fontStyle="italic"> { el.createdAt && convertDate(el.createdAt) }  </Text>
                              </Box>

                              <AccordionIcon />
                            </AccordionButton>
                          
                          <AccordionPanel pb={4}>
                            <Box display="flex" flexDirection="row" my="1.25rem"> 
                                <Text ml=".5rem"  fontWeight="bold"> Email : </Text>
                                <Text ml=".5rem"> { el.email && el.email } </Text>
                            </Box>
                            <Box display="flex" flexDirection="row" my="1.25rem"> 
                                <Text ml=".5rem"  fontWeight="bold"> Full Name : </Text>
                                <Text ml=".5rem"> { el.fullName && el.fullName } </Text>
                            </Box>
                            <Box display="flex" flexDirection="row" my="1.25rem"> 
                                <Text ml=".5rem"  fontWeight="bold"> Subject : </Text>
                                <Text ml=".5rem"> { el.subject && el.subject } </Text>
                            </Box>
                            <Box display="flex" flexDirection="row" my="1.25rem">   
                                <Text ml=".5rem"  fontWeight="bold"> Message : </Text>
                                <Text ml=".5rem">  { el.message && el.message } </Text>
                            </Box>

                            <ButtonGroup display="flex" flexDir="row" justifyContent="flex-end">
                                <IconButton colorScheme="blue" aria-label="reply user" my=".25rem" ml="0" variant="outline" 
                                            icon={<BsReplyFill />} onClick={() => replyContact(el._id, idx, el.userId)} />
                                <IconButton colorScheme="blue" aria-label="check message" my=".25rem" ml="0" variant="outline" 
                                            icon={<BsCheckBox />} onClick={() => checkContact(el._id, idx)} />
                                <IconButton colorScheme="blue" aria-label="hide message" my=".25rem" ml="0" variant="outline" 
                                            icon={<BsFillEyeSlashFill />} onClick={() => hideContact(el._id, idx)} /> 
                            </ButtonGroup>
                          </AccordionPanel>
                        </AccordionItem>
                      </Accordion>
                    )
              }
            </Box>
  };
  
  useEffect(() => {
    getContacts();
  }, []);

  return (
    <Layout isFixedNav isVisible>
      <Container maxW="80em" bg="white" py="39px" px={["16px","","","40px"]} m="0 auto" borderRadius="4px">
        <Heading as="h2" size="lg" textAlign="left" my="2rem"> Contacts </Heading>

        { action.value === "contacts" ? 
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">

                {displayContactsFilter()}
                
                { loading ? 
                  <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="lg" /> : 
                  (contacts && contacts.length > 0) ? displayContacts(contacts) :
                  <Heading as="h4" size="md" textAlign="center"> There is not any Contact </Heading>
                }
              </Box> : ""
        }
            
          
        <Portal> 
          { action.data && displayModal(action.data && action.data) } 
        </Portal>      
      </Container>
    </Layout>
  );
};

export default Contacts;