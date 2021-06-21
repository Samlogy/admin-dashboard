import React, { useState, useEffect } from "react";
import { BiBlock, BiTrash, BiPencil, BiDetail, BiUser } from "react-icons/bi"
import { BsReplyFill, BsFillEyeSlashFill, BsCheckBox } from "react-icons/bs"
import { FormControl, FormLabel, Input, Select, Checkbox, Text, Heading, Radio, RadioGroup, Textarea,
  Spinner,
  useToast, useDisclosure,
  Flex, Stack, Box, 
  Avatar,
  Button, ButtonGroup, IconButton,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, 
  Image,
  InputRightElement, InputGroup,
  Menu, MenuList, MenuItem, MenuButton,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  Portal,
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

const data = [
    {
        email: "s@gmail.com",
        subject: "le sujet ici",
        message: "le message ici...",
        status: "unchecked",
        createdAt: "",
        avatar: "qsdsqd",
        username: "the username"
    },
    {
        email: "s@gmail.com",
        subject: "le sujet ici",
        message: "le message ici...",
        status: "unchecked",
        createdAt: "",
        avatar: "qsdsqd",
        username: "the username"
    },
    {
        email: "s@gmail.com",
        subject: "le sujet ici",
        message: "le message ici...",
        status: "unchecked",
        createdAt: "",
        avatar: "qsdsqd",
        username: "the username"
    },
];

const Contacts = () => {
  const [contact, setContact] = useState({ responseTo: "", message: "" });
  const [contacts, setContacts] = useState(data || []);
  const [filter, setFilter] = useState({ queryString: "", filterStatus: "unchecked", filterType: "", filterDate: "" });
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState({ value: "contacts", data: null })

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Functions
  const convertDate = (date) => {
    const new_date = new Date(date).toLocaleDateString("en-US").split(/:| /)[0];
    return new_date;
  };
  const backToContacts = () => {
    setAction({ value: "contacs" })
    // setUser({ fullName: "", username: "", email: "", password: "", role: "" })
  };

  const hideContact = (contactId, contactIndex) => {
    setAction({ 
      data: { text: "Are you sure to Hide this Contact ?", 
              action: () => onHide(contactId, contactIndex), label: "Hide" } 
    }); 
    onOpen()
  };
  const replyContact = (contactId, contactIndex) => {
    // 
  };
  const checkContact = (contactId, contactIndex) => {
    //
  };

  // API calls
  const getContacts = async () => {
    setLoading(true);
    try {
      const url = `${proxy}/admin/contact/getContacts`;
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
  const onHide = async (contactId) => {
    const url = `${proxy}/admin/contacts/hide/${contactId}`

    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "applicaion/json"
        },
        method: "PUT",
        body: { status: "hidden"}
      })

      if (res.ok) {
        const result = await res.json()
        console.log(result.data)
        // update state after edit op
        displayToast({ msg: result.message, status: "error" })
      }

    } catch (err) {
      displayToast({ msg: err.message, status: "error" })
    }
  };
  const onCheck = async (contactId) => {
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
        displayToast({ msg: result.message, status: "error" })
      }

    } catch (err) {
      displayToast({ msg: err.message, status: "error" })
    }
  };
  const onReply = async (contactId) => {
    const url = `${proxy}/admin/contacts/reply/${contactId}`
    // contact.responseTo = contactUserId

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
        displayToast({ msg: result.message, status: "error" })
      }

    } catch (err) {
      displayToast({ msg: err.message, status: "error" })
    }
  };
  const onFilter = async (value) => {
    setFilter({ ...filter, queryString: value });
    setLoading(true);

    try {
      const url = `${proxy}/admin/users/filterUsers?queryString=${value}&filterStatus=${filter.filterStatus}`;
      const res = await fetch(url);

      if (res.ok) {
        const result = await res.json();
        console.log('contacts: ', result.data)
        // setUsers(result.data);
        setLoading(false);
        console.log(result.message);
        return;
      }
      console.log("an Error occured while filtering contacts !");
    } catch (err) {
      console.log("Error: ", err.message);
    }
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
                  <Button variant="outiline" colorScheme="blue" onClick={() => { backToContacts(); onClose()}}> Cancel </Button>
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
            {/* merge userData + contactData */}
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

                                <Text my="auto" mr="1rem" fontStyle="italic"> { el.createdAt && convertDate(el.createdAt) }  </Text>
                              </Box>

                              <AccordionIcon />
                            </AccordionButton>
                          
                          <AccordionPanel pb={4}>
                            <Text my="1rem"> { el.message && el.message } </Text>

                            <ButtonGroup display="flex" flexDir="row" justifyContent="flex-end">
                                <IconButton colorScheme="blue" aria-label="delete user" my=".25rem" ml="0" variant="outline" 
                                            icon={<BsReplyFill />} onClick={() => onReply(el._id, idx)} />
                                <IconButton colorScheme="blue" aria-label="delete user" my=".25rem" ml="0" variant="outline" 
                                            icon={<BsCheckBox />} onClick={() => onCheck(el._id, idx)} />
                                <IconButton colorScheme="blue" aria-label="delete user" my=".25rem" ml="0" variant="outline" 
                                            icon={<BsFillEyeSlashFill />} onClick={() => onHide(el._id, idx)} /> 
                            </ButtonGroup>
                          </AccordionPanel>
                        </AccordionItem>
                      </Accordion>
                    )
              }
            </Box>
  };
  
//   useEffect(() => {
//     getContacts();
//   }, []);

  return (
    <Layout isFixedNav isVisible>
      <Flex flexDirection="column" width="90vw">
            <Heading as="h2" size="lg" textAlign="left" my="2rem"> Contacts </Heading>

            {
              action.value === "contacts" ? 
                  <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">

                    {displayContactsFilter()}
                    
                    { loading ? 
                      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="lg" /> : 
                      (contacts &&contacts.length > 0) ? displayContacts(contacts) :
                      <Heading as="h4" size="md" textAlign="center"> There is not any Contact </Heading>
                    }
                  </Box> : ""
            }
                
              
            <Portal> 
              { action.data && displayModal(action.data && action.data) } 
            </Portal>      
      </Flex>      
    </Layout>
  );
};

export default Contacts;