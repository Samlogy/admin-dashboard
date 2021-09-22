import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Tabs, TabList, TabPanels, Tab, TabPanel,
        FormControl, FormLabel, Input, Flex, useToast,
        Heading, Button, Box, Text, Container } from "@chakra-ui/react"
import Parser from 'html-react-parser'

import { MyEditor } from "../../Components"
import Layout from "../Layout.jsx"
import { send_newsletter } from "../../api"
import "./style.css";

const WriteNewsletter = () => {
  const [newsletter, setNewsletter] = useState({ subject: "", message: "" });
  const [files, setFiles] = useState([]);
  const [action, setAction] = useState(0);

  const authStore = useSelector(state => state.auth)
  const toast = useToast();

  const onEditorChange = (value) => {
    setNewsletter({ ...newsletter, message: value });
  };
  const onFilesChange = (files) => {
    setFiles(files);
  };
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

  return (
      <Layout isFixedNav isVisible>
        <Container maxW="80em" py="39px" px={["16px","","","40px"]} m="0 auto" borderRadius="4px">
          <Heading as="h2" size="md" my="2rem" textAlign="left">
            { action === 0 ? "Write Newsletter" : "Preview Newsletter" }
          </Heading>

          <SwitchViews setAction={setAction} newsletter={newsletter} setNewsletter={setNewsletter} sendNewsletter={sendNewsletter} onEditorChange={onEditorChange} onFilesChange={onFilesChange} />
        </Container>
      </Layout>
  );
};

const SwitchViews = ({ setAction, newsletter, setNewsletter, sendNewsletter, onEditorChange, onFilesChange }) => {
  return(
    <Tabs align="center" isFitted variant="soft-rounded" colorScheme="blue"
          onChange={(idx) => setAction(idx)}>
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

export default WriteNewsletter;
