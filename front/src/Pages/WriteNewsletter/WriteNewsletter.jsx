import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Tabs, TabList, TabPanels, Tab, TabPanel,
        FormControl, FormLabel, Input, Flex, useToast, useDisclosure,
        Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
        Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
        Heading, Button, Box, Text, Spinner, Container } from "@chakra-ui/react"
import Parser from 'html-react-parser'
import { AiOutlineUserAdd } from "react-icons/ai"

import { MyEditor, View } from "../../Components"
import Layout from "../Layout.jsx"
import { send_newsletter, load_newsletters } from "../../api"
import "./style.css";

const WriteNewsletter = () => {
  const [newsletter, setNewsletter] = useState({ subject: "", message: "" });
  const [newsletters, setNewsletters] = useState([]);
  const [files, setFiles] = useState([]);
  const [actionTab, setActionTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState({ value: "newsletters", data: null });

  const authStore = useSelector(state => state.auth)
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()

  const onEditorChange = (value) => {
    setNewsletter({ ...newsletter, message: value });
  };
  const onFilesChange = (files) => {
    setFiles(files);
  };
  const convertDate = (date) => {
    const new_date = new Date(date).toLocaleDateString("en-US").split(/:| /)[0];
    return new_date;
  };

  // API
  const sendNewsletter = async () => {   
    const variables = {
      newsletterData: newsletter,
      files: files,
      authorID: authStore.userData._id
    };

    const result = await send_newsletter(variables);

    if (result.success) {
      displayToast({ msg: result.message, status: "success" })
      return;
    }
    displayToast({ msg: "an Error occured while sending newsletter !", status: "error" })
  };
  const onLoad = async () => {
    setLoading(true);
    const result = await load_newsletters();
    if (result.success) {
      console.log('result: ', result)
      setLoading(false);
      setNewsletters(result.data);
      return;
    }
    setLoading(false);
    displayToast({msg: "an Error occured while loading users !", status: "error"})
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

  useEffect(() => {
    onLoad();
  }, []);

  return (
      <Layout isFixedNav isVisible>
        <Container maxW="80em" py="39px" px={["16px","","","40px"]} m="0 auto" borderRadius="4px">
          <Heading as="h2" size="lg" textAlign="left" my="2rem"> Newsletters Management </Heading>

          <View if={action.value === "create"}>
             <Heading as="h2" size="md" my="2rem" textAlign="left">
                { actionTab === 0 ? "Write Newsletter" : "Preview Newsletter" }
              </Heading>

              <SwitchViews setActionTab={setActionTab} newsletter={newsletter} setNewsletter={setNewsletter} sendNewsletter={sendNewsletter} onEditorChange={onEditorChange} onFilesChange={onFilesChange} />
          </View>

          <View if={action.value === "newsletters" && newsletters}>
            <Flex flexDirection="column" justifyContent="center" alignItems="center">
                <Button colorScheme="blue" variant="outline" w="6rem" alignSelf="flex-end" rightIcon={<AiOutlineUserAdd size="20" />} 
                        onClick={() => setAction({value: "create"})}> Create </Button>

                {/* <UserFilter filter={filter} onFilter={onFilter} setFilter={setFilter} /> */}
                
                { loading ? 
                    <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="lg" /> : 
                      newsletters.length > 0 ? 
                        <NewslettersList newsletters={newsletters} convertDate={convertDate} /> :
                          <Heading as="h4" size="md" textAlign="center"> There is not any Newsletter </Heading>
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
const SwitchViews = ({ setActionTab, newsletter, setNewsletter, sendNewsletter, onEditorChange, onFilesChange }) => {
  return(
    <Tabs align="center" isFitted variant="soft-rounded" colorScheme="blue"
          onChange={(idx) => setActionTab(idx)}>
      <TabList w="10rem">
        <Tab mx=".25rem"> Write </Tab>
        <Tab mx=".25rem"> Preview </Tab>
      </TabList>
      
      <TabPanels>
        <TabPanel>
          <Write newsletter={newsletter} setNewsletter={setNewsletter} sendNewsletter={sendNewsletter} onEditorChange={onEditorChange} onFilesChange={onFilesChange} />
        </TabPanel>

        <TabPanel>
          <Preview newsletter={newsletter} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
const Preview = ({ newsletter }) => {
  return(
    <Flex border="1px solid" borderColor="gray.200" p="2rem" borderRadius="md" width="35rem" m="2rem auto"
          flexDirection="column"  boxShadow="md">
      <Box display="flex" flexDirection="column"> 
        <Text mb="1rem" fontWeight="bold" textAlign="left"> Subject: </Text>
        <Text mb="2rem" p=".5rem"> {newsletter.subject && newsletter.subject} </Text> 
      </Box>

      <Box>
        <Text mb="1rem" fontWeight="bold" textAlign="left"> Message: </Text>
        <Text p=".5rem"> {newsletter.message && Parser(newsletter.message)} </Text>  
      </Box>
    </Flex>
  )
};
const Write = ({ newsletter, setNewsletter, sendNewsletter, onEditorChange, onFilesChange }) => {
  return(
    <Flex border="1px solid" borderColor="gray.200" p="2rem" borderRadius="md" width="35rem" m="2rem auto"
          flexDirection="column" justifyContent="center" alignItems="center" boxShadow="md">
      <FormControl id="email" mb="1rem">
        <FormLabel> Subject </FormLabel>
        <Input type="text" id="subject"  placeholder="Subject" name="subject" value={newsletter.subject}
              onChange={(e) => setNewsletter({ ...newsletter, subject: e.target.value }) } />
      </FormControl>

      <FormControl id="newsletter" mb="1rem">
        <FormLabel> Newsletter Content </FormLabel>
        <MyEditor placeholder="Newsletter Content"
                  onEditorChange={onEditorChange} onFilesChange={onFilesChange} />
      </FormControl>

      <Button mt="1rem" colorScheme="blue" variant="solid" onClick={() => sendNewsletter()}>
        Send
      </Button> 
    </Flex>
)
};
const RenderNewsletter = ({ newsletter, convertDate }) => {
  const { email, subject, message, createdAt } = newsletter;

  return(
      <Accordion allowToggle allowMultiple w={["60vw", "650px", "", ""]} mt="3rem">
          <AccordionItem>
              <AccordionButton>
              <Flex justifyContent="space-between" flex="1">
                  <Text my="auto" w="150px"> { subject } </Text>
                  <Text my="auto" mr="1rem"> { createdAt && convertDate(createdAt) }  </Text>
              </Flex>

              <AccordionIcon />
              </AccordionButton>
          
          <AccordionPanel pb={4}>
              <Flex>
                <Box as="span" color="gray.400"> Subject: </Box>
                <Text m="auto 0 auto 12px"> { subject } </Text>
              </Flex>

              <Flex>
                <Box as="span" color="gray.400"> to: </Box>
                <Text m="auto 0 auto 12px"> { email.map(el => el).join(', ') } </Text>
              </Flex>
              
              <Text my="1rem"> { Parser(message) } </Text>
          </AccordionPanel>
          </AccordionItem>
      </Accordion>
  )
};
const NewslettersList = ({ newsletters, convertDate }) => {
  return(
    <Flex>
      { newsletters.map((el, idx) => <RenderNewsletter newsletter={el} convertDate={convertDate} />) }
    </Flex>
  )
};


export default WriteNewsletter;
