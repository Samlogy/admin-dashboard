import React, { useState } from "react";
import { Heading, Button, ButtonGroup, Box } from "@chakra-ui/react"

 import Write from "./Write.jsx"
 import Preview from "./Preview.jsx"
 import { NavBar } from "../../Components"


import "./style.css";

const proxy = "http://localhost:5000/";

const WriteNewsletter = () => {
  const [action, setAction] = useState("write");
  const [saved, setSaved] = useState(false);
  

  return (
    <>
      <NavBar />

      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center"
          p="2rem"> 
        <Heading as="h2" size="md" my="1rem" textAlign="left">
          { action === "write" ? "Write Newsletter" : "Preview Newsletter" }
        </Heading>

        <ButtonGroup>
          { action === "preview" ?  <Button mt="1rem" colorScheme="blue" variant="solid" 
                                                  onClick={() => setAction("write")}>
                                            Write
                                          </Button> :

            action === "write" ?  <Button mt="1rem" colorScheme="blue" variant="solid"
                                                onClick={() => {
                                                  setAction("preview");
                                                  setSaved(true)
                                                }}>
                                          Preview
                                        </Button> : ""
          }
        </ButtonGroup>

        { action === "write" ? 
          <Write saved={saved && saved} /> : 
          <Preview saved={saved && saved} /> 
        }     
      </Box>
    </>
  );
};

export default WriteNewsletter;
