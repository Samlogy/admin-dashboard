import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FormControl, FormLabel, Input, Button, Flex, useToast } from "@chakra-ui/react"

 import { MyEditor, } from "../../Components"
 import { saveState } from "../../utils/localStorage";

import "./style.css";

const proxy = "http://localhost:5000/";

const Write = (props) => {
  const [newsletter, setNewsletter] = useState({ subject: "", message: "" });
  const [files, setFiles] = useState([]);

  const authStore = useSelector(state => state.auth)
  const toast = useToast();

  const onEditorChange = (value) => {
    setNewsletter({ ...newsletter, message: value });
  //   console.log(newsletter.message);
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
        displayToast({ msg: result.message, status: "success" })
        return;
      }
      displayToast({ msg: "an Error occured while editing post !", status: "error" })

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

  // save subject && message data inside localStorage
  useEffect(() => {
    if (props.saved) {
      saveState("newsletter-data", {
        newsletterData: newsletter,
        files: files,
        authorID: authStore.userData._id
      })
    }
  }, []);
  
  return(
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
  )
};

export default Write;