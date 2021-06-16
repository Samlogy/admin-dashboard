import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Heading, 
  FormControl, FormLabel, Input, Button,
  Flex,
 } from "@chakra-ui/react"

import TopBar from "../../Components/TopBar/TopBar"
import SideBar from "../../Components/SideBar/SideBar"
import MyEditor from "../../Components/Editor/MyEditor.jsx";

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
    <TopBar />
 
      <Heading as="h2" size="lg" my="1rem">
        Write Newsletter
      </Heading>

      <Flex border="1px" borderColor="gray.200" borderStyle="solid" p="2rem" borderRadius="md" width="500px" my="2rem" mx="auto"
            flexDirection="column" justifyContent="center" alignItems="center">
        <FormControl id="email" mb="1rem">
          <FormLabel> Subject </FormLabel>
          <Input type="text" id="subject"  placeholder="Subject" name="subject" value={newsletter.subject}
                  onChange={(e) => setNewsletter({ ...newsletter, subject: e.target.value }) } />
        </FormControl>

        <FormControl id="newsletter" mb="1rem">
          <FormLabel> Newsletter Content </FormLabel>
          <MyEditor
            placeholder="Newsletter Content"
            onEditorChange={onEditorChange}
            onFilesChange={onFilesChange}
          />
        </FormControl>

        <Button mt="1rem" colorScheme="blue" variant="solid" onClick={() => writeNewsltter()}>
          Send
        </Button> 
      </Flex>

    {/* <SideBar /> */}
    </>
  );
};

export default WriteNewsletter;
