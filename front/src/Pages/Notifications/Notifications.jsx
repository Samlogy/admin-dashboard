import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, Flex, Heading, Select, Box, Spinner, VStack, Avatar, Text, IconButton, ButtonGroup,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, 
  useDisclosure, useToast, 
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  } from "@chakra-ui/react"
import { BsTrash, BsFillEyeSlashFill  } from "react-icons/bs";

import Layout from "../Layout.jsx"
// import Accordion from "../../Components/Accordion/Accordion"
// import proxy from "../../proxy"

const proxy = "http://localhost:5000"

const Notifications = () => {
    const [notif, setNotif] = useState({
        response: [], contacts: [], posts: [], comments: [], appNews: [], type: "all", loading: false
      })
    const [action, setAction] = useState({ value: "", data: null })
    
      const authStore = useSelector(state => state.auth)
      const toast = useToast();
      const { isOpen, onOpen, onClose } = useDisclosure()
    
      /* Functions */
      const sortNotifs = (data) => {
        // sort notifs arr into arrs according to types retrieved
        data.forEach(el => { 
          switch (el.type) {
            case "contact": {
              setNotif((prevState) => {
                return { ...prevState, contacts: [...prevState.contacts, el]}
              })
              break
            }
            case "comment": {
              setNotif((prevState) => {
                return { ...prevState, comments: [...prevState.comments, el]}
              })
              break
            }
            case "post": {
              setNotif((prevState) => {
                return { ...prevState, posts: [...prevState.posts, el]}
              })
              break
            }
            case "appNews": {
              setNotif((prevState) => {
                return { ...prevState, appNews: [...prevState.appNews, el]}
              })
              break
            }
            default: break
          }
        })
      };
      const checkType = (type) => {
        switch(type) {
          case "all": {
            return <>
                    { displayNotifs("Contacts", notif.contacts) }
                    { displayNotifs("Comments", notif.comments) }
                    { displayNotifs("Posts", notif.posts) }
                    { displayNotifs("App News", notif.appNews) }
                   </>
            break;
          }
          case "contacts": {
            return displayNotifs("Contacts", notif.contacts)
            break;
          }
          case "comments": {
            return displayNotifs("Comments", notif.comments)
            break;
          }
          case "posts": {
            return displayNotifs("Posts", notif.posts)
            break;
          }
          case "appNews": {
            return displayNotifs("App News", notif.appNews)
            break;
          }
          default: {
            return <>
                    { displayNotifs('Contacts', notif.contacts) }
                    { displayNotifs('Contacts', notif.comments) }
                    { displayNotifs('Contacts', notif.posts) }
                    { displayNotifs('Contacts', notif.appNews) }
                   </>
          }
        }
      };
      const convertDate = (date) => {
        const new_date = new Date(date).toLocaleDateString("en-US").split(/:| /)[0]
        return new_date
      };
      const deleteNotif = (notifId, notifIndex) => {
        setAction({ 
          data: { text: "Are you sure to Delete this Notification ?", 
                  action: () => onDelete(notifId, notifIndex), label: "Delete" } 
        }); 
        onOpen()
      };
      const hideNotif = (notifId, notifIndex) => {
        setAction({ 
          data: { text: "Are you sure to Hide this Notification ?", 
                  action: () => onHide(notifId, notifIndex), label: "Hide" } 
        }); 
        onOpen()
      };

      /* API Calls */
      const loadNotifications = async () => {
        setNotif({...notif, loading: true })
        const userId = authStore.userData._id
        const url = `${proxy}/admin/notifications/${userId}`
    
        try {
          const res = await fetch(url)
         
          if (res.ok) {
            const result = await res.json()
            // set state
            setNotif((prevState) => {
                return { ...prevState, response: [...result.data, prevState], loading: false }
            })
            // sort data
            sortNotifs(result.data)
            return;
          }
          displayToast({ msg: "Error occured while loading User Notification !", status: "error" })
    
        } catch (err) {
          displayToast({ msg: err.message, status: "error" })
        }
      };
      const onDelete = async (notificationId) => {
        const url = `${proxy}/admin/notifications/delete/${notificationId}`
    
        try {
          const res = await fetch(url, { method: 'DELETE' })
    
          if (res.ok) {
            const result = await res.json()
            // update state after delete op
            displayToast({ msg: result.message, status: "error" })
            return;
          }
    
        } catch (err) {
          displayToast({ msg: err.message, status: "error" })
        }
      };
      const onHide = async (notificationId) => {
        const url = `${proxy}/admin/notifications/hide/${notificationId}/${'hidden'}`
    
        try {
          const res = await fetch(url, {
            headers: {
              "Content-Type": "applicaion/json"
            },
            method: "PUT",
            body: {}
          })
    
          if (res.ok) {
            const result = await res.json()
            console.log(result.data)
            // update state after edit op
            displayToast({ msg: result.message, status: "error" })
            return;
          }
    
        } catch (err) {
          displayToast({ msg: err.message, status: "error" })
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
                      <Button variant="outiline" colorScheme="blue" onClick={() => onClose()}> Cancel </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
      };
      const displayNotifs = (label, data) => {
        return  <Box w="45rem" p="1rem" mb="1rem" border="1px" borderColor="gray.200" borderStyle="solid" borderRadius="md"
                      boxShadow="md">
                  <Heading as="h3" size="md" mt="0" mb="1rem"> {label} </Heading>
    
                  {  data.length > 0 ?
                     data.map((el, idx) =>
                          <Accordion allowToggle allowMultiple>
                            <AccordionItem>
                                <AccordionButton>
                                  <Box display="flex" flexDirection="row" justifyContent="space-between" flex="1">
                                    { el.avatar ? 
                                        <Avatar name={el.username && el.username} src={el.avatar} size="sm" /> :
                                        <Avatar name={el.username && el.username} src={el.avatar} size="md" /> 
                                    }

                                    <Text my="auto"> { el.type && el.type } </Text>

                                    <Text my="auto" mr="1rem"> { el.createdAt && convertDate(el.createdAt) }  </Text>
                                  </Box>

                                  <AccordionIcon />
                                </AccordionButton>
                              
                              <AccordionPanel pb={4}>
                                <Text my="1rem"> { el.content && el.content } </Text>

                                <ButtonGroup display="flex" flexDirection="row" justifyContent="flex-end">
                                  <IconButton colorScheme="blue" variant="outline" aria-label="delete user" my=".25rem" ml="0" icon={<BsTrash />} 
                                              onClick={() => deleteNotif(el._id, idx)} />
                                  <IconButton colorScheme="blue" variant="outline" aria-label="delete user" my=".25rem" ml="0" icon={<BsFillEyeSlashFill />} 
                                              onClick={() => hideNotif(el._id, idx)} />
                                </ButtonGroup>
                              </AccordionPanel>
                            </AccordionItem>
                          </Accordion>
                        )
                    : `No ${label}`
                  }
                </Box>
      };
        
      useEffect(() => {
        loadNotifications()
      }, [])     
  
    return (
        <Layout isFixedNav isVisible>
            <Heading as="h2" size="lg" my="2rem"> Notifications </Heading>

            <Select name="notif-type" w="200px" mb="2rem"
                    value={notif.type} onChange={e => setNotif({...notif, type: e.target.value})}>
              <option value="all"> All </option>
              <option value="contacts"> My Contacts </option>
              <option value="comments"> My Comments </option>
              <option value="posts"> My Posts </option>
              <option value="appNews"> App News </option>
            </Select>
            
            <Box>
              {   notif.loading ? 
                  <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="lg" /> :
                  notif.response ?
                      <VStack>
                        { notif.type && checkType(notif.type) }
                      </VStack> :
                  <h3> There is not any new Notification </h3>
              }
            </Box>

            { action.data && displayModal(action.data && action.data)  }   
        </Layout>
    )
};

export default Notifications;
