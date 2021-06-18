import React, { useState, useEffect } from "react";
import { Text, Flex, Box } from "@chakra-ui/react"
 import Parser from 'html-react-parser'

 import { loadState } from "../../utils/localStorage";

const Preview = (props) => {
    // const { saved } = props;
    const [newsletter, setNewsletter] = useState({ subject: "", message: "" });

    // load Data from localStorage
    useEffect(() => {
      if (props.saved) {
        console.log(loadState("newsletter-data").newsletterData)
        setNewsletter(loadState("newsletter-data").newsletterData)
      }
    }, []);
  
    return(
          <Flex border="1px" borderColor="gray.200" borderStyle="solid" p="2rem" borderRadius="md" width="35rem" my="2rem" mx="auto"
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

export default Preview;