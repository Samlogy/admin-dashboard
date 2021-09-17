import React from 'react'
import { Flex, Heading, Button, Text, ButtonGroup, Container } from "@chakra-ui/react"

import Layout from "./Layout.jsx"

function NotFound() {
  
  // minHeight="100vh"
  return (
      <Layout> 
        <Container maxW="80em" bg="white" py="39px" px={["16px","","","40px"]} m="10vh auto 0 auto" borderRadius="4px"
                  display="flex" flexDir="column" justifyContent="center" alignItems="center">
          <Heading as="h1" size="2xl" my="2rem">
            404 not Found
          </Heading>

          <Text maxW="60em" m="2rem auto" textAlign="center"> Sorry this web Page do not exist please click in the button bellow to login </Text>

          <ButtonGroup>
            <Button as="a" href="/" variant="solid"
                    p=".5rem" borderRadius="md" colorScheme="blue"> 
              Back to Login 
            </Button>
            <Button as="a" href="/home" variant="outline"
                    p=".5rem" borderRadius="md" colorScheme="blue"> 
              Back to Dashboard 
            </Button>
          </ButtonGroup>
        </Container>
      </Layout>
  );
}

export default NotFound
