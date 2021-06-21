import React from 'react'
import { Flex, Heading, Button, Text, ButtonGroup } from "@chakra-ui/react"

import Layout from "./Layout.jsx"

function NotFound() {
  
  // minHeight="100vh"
  return (
      <Layout> 
          <Heading as="h1" size="2xl" my="2rem">
            404 not Found
          </Heading>

          <Text my="2rem"> Sorry this web Page do not exist please click in the button bellow to login </Text>

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
      </Layout>
  );
}

export default NotFound
