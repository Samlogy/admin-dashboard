import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Heading, Text,
  FormControl, FormLabel, Input, Button,
  Flex, Box
 } from "@chakra-ui/react"
 import Parser from 'html-react-parser'

 import { NavBar, MyEditor, } from "../../Components"

import "./style.css";

const proxy = "http://localhost:5000/";

const WriteNewsletter = () => {
  const [newsletter, setNewsletter] = useState({ subject: "", message: "" });
  const [files, setFiles] = useState([]);

  const authStore = useSelector(state => state.auth)

  const onEditorChange = (value) => {
    setNewsletter({ ...newsletter, message: value });
    console.log(newsletter.message);
  };
  const onFilesChange = (files) => {
    setFiles(files);
  };

  const writeNewsltter = async () => {
    const url = `${proxy}/admin/writeNewsletter`;

    // newsletter data validation --> schema
    const variables = {
      newsletterData: newsletter,
      files: files,
      authorID: authStore.userData._id
    };

    try {
      const res = await fetch(url, {
        headers: {
          "content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(variables)
      });

      if (res.ok) {
        const result = await res.json();
        console.log(result.message);
        return;
      }
      console.log("an Error occured while editing post !");
      // console.log(variables);
    } catch (err) {
      console.log("Error: ", err.message);
    }
  };

  return (
    <>
      <NavBar />

      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center"
          p="2rem"> 
        <Heading as="h2" size="md" my="1rem" textAlign="left">
          Write Newsletter
        </Heading>

        <Flex border="1px" borderColor="gray.200" borderStyle="solid" p="2rem" borderRadius="md" width="35rem" my="2rem" mx="auto"
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

          <Button mt="1rem" colorScheme="blue" variant="solid" onClick={() => writeNewsltter()}>
            Send
          </Button> 
        </Flex>

        <Heading as="h2" size="md" my="1rem" textAlign="left">
          Preview
        </Heading>

        <Flex border="1px" borderColor="gray.200" borderStyle="solid" p="2rem" borderRadius="md" width="35rem" my="2rem" mx="auto"
              flexDirection="column" justifyContent="center" alignItems="center" boxShadow="md">
          <Box display="flex" flexDirection="column"> 
            <Text mb="1rem" fontWeight="bold" textAlign="left"> Subject: </Text>
            <Text mb="2rem"> {newsletter.subject && newsletter.subject} </Text> 
          </Box>

          <Box>
            <Text mb="1rem" fontWeight="bold" textAlign="left"> Message: </Text>
            <Text> {newsletter.message && Parser(newsletter.message)} </Text>  
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default WriteNewsletter;
