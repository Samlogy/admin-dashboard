import React from 'react'
import { Flex, Heading, Button, Text, ButtonGroup } from "@chakra-ui/react"


function NotFound() {
  
  
  return (
      <Flex flexDirection="column" justifyContent="center" alignItems="center"
            p="2rem">
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
      </Flex>
  );
}

export default NotFound
