import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, Heading, Select, Box, Spinner, Avatar, Text, IconButton, ButtonGroup,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, 
  useDisclosure, useToast, Container,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  } from "@chakra-ui/react"
import { BsTrash, BsFillEyeSlashFill  } from "react-icons/bs";

import Layout from "../Layout.jsx"
import { View } from "../../Components"
import { load_notifications, delete_notification, hide_notification } from "../../api"

const Notifications = () => {
    const [notif, setNotif] = useState({
        response: [], contacts: [], posts: [], comments: [], appNews: [], type: "all", loading: false
      })
    const [action, setAction] = useState({ value: "", data: null })
    
      const authStore = useSelector(state => state.auth);
      const toast = useToast();
      const { isOpen, onOpen, onClose } = useDisclosure();
    
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
      const onLoad = async () => {
        setNotif({...notif, loading: true })
        const userId = authStore.userData._id
        const result = await load_notifications(userId);

        if (result.success) {
          // set state
          setNotif((prevState) => {
              return { ...prevState, response: [...result.data, prevState], loading: false }
          })
          // sort data
          sortNotifs(result.data)
          return;
        }
        setNotif({...notif, loading: false })
        displayToast({ msg: "Error occured while loading User Notification !", status: "error" })
      };
      const onDelete = async (notificationId) => {
        const result = await delete_notification(notificationId);
        if (result.success) {
          // update state after delete op
          displayToast({ msg: result.message, status: "error" })
          return;
        }
        displayToast({ msg: "Error occured while deleting Notification !", status: "error" })
      };
      const onHide = async (notificationId) => {
        const result = await hide_notification(notificationId);
        if (result.success) {
          // update state after delete op
          displayToast({ msg: result.message, status: "error" })
          return;
        }
        displayToast({ msg: "Error occured while hidding Notification !", status: "error" })
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
        
      useEffect(() => {
        onLoad()
      }, [])     
  
    return (
        <Layout isFixedNav isVisible>
          <Container maxW="80em" py="39px" px={["16px","","","40px"]} m="0 auto" borderRadius="4px">
            <Heading as="h2" size="lg" my="2rem"> Notifications </Heading>

            <Select name="notif-type" w="200px" mb="2rem"
                    value={notif.type} onChange={e => setNotif({...notif, type: e.target.value})}>
              <option value="all"> All </option>
              <option value="contacts"> My Contacts </option>
              <option value="comments"> My Comments </option>
              <option value="posts"> My Posts </option>
              <option value="appNews"> App News </option>
            </Select>
            
            <View if={notif.loading}>
              <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="lg" />
            </View>
            
            <View if={!notif.loading && notif.response}>
              <View if={notif.type} display="flex" flexDir="column" maxW="45rem" mx="auto">
                <RenderByType notif={notif} convertDate={convertDate} deleteNotif={deleteNotif} hideNotif={hideNotif} /> 
              </View>
            </View>

            <View if={!notif.loading && !notif.response}>
              <h3> There is not any new Notification </h3>
            </View>
 
            <View if={action.data}>
              <ModalBox data={action.data} isOpen={isOpen} onClose={onClose} />
            </View>
          </Container> 
        </Layout>
    )
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

const RenderByType = ({ notif, convertDate, deleteNotif, hideNotif }) => {
    return(
      notif.type === "all" ?  <>
                                <RenderNotifications label={"Contacts"} data={notif.contacts} convertDate={convertDate} deleteNotif={deleteNotif} hideNotif={hideNotif} />
                                <RenderNotifications label={"Comments"} data={notif.comments} convertDate={convertDate} deleteNotif={deleteNotif} hideNotif={hideNotif} />
                                <RenderNotifications label={"Posts"} data={notif.posts} convertDate={convertDate} deleteNotif={deleteNotif} hideNotif={hideNotif} />
                                <RenderNotifications label={"App News"} data={notif.appNews} convertDate={convertDate} deleteNotif={deleteNotif} hideNotif={hideNotif} />
                              </> :

      notif.type === "contacts" ? <RenderNotifications label={"Contacts"} data={notif.contacts} convertDate={convertDate} deleteNotif={deleteNotif} hideNotif={hideNotif} /> :
      notif.type === "comments" ? <RenderNotifications label={"Comments"} data={notif.comments} convertDate={convertDate} deleteNotif={deleteNotif} hideNotif={hideNotif} /> :
      notif.type === "posts" ?  <RenderNotifications label={"Posts"} data={notif.posts} convertDate={convertDate} deleteNotif={deleteNotif} hideNotif={hideNotif} /> :
      notif.type === "appNews" ? <RenderNotifications label={"App News"} data={notif.appNews} convertDate={convertDate} deleteNotif={deleteNotif} hideNotif={hideNotif} /> 
                               : "No corresponding type !"
    )
};

const RenderNotifications = ({ label, data, convertDate, deleteNotif, hideNotif }) => {
  return  <Box maxW="45rem" p="1rem" mb="1rem" border="1px" borderColor="gray.200" borderStyle="solid" borderRadius="md"
                boxShadow="md">
            <Heading as="h3" size="md" mt="0" mb="1rem"> {label} </Heading>

            <View if={data.length > 0}>
              { data.map((el, idx) =>
                  <Accordion allowToggle allowMultiple>
                    <AccordionItem>
                        <AccordionButton>
                          <Box display="flex" flexDirection="row" justifyContent="space-between" flex="1">
                            { el.avatar && 
                                <Avatar name={el.username} src={el.avatar} size="sm" />  
                            }

                            <Text my="auto"> { el.type } </Text>
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
              }
            </View>

            <View if={data.length === 0}>
              <Text> No {label} </Text>
            </View>
          </Box>
};

export default Notifications;
