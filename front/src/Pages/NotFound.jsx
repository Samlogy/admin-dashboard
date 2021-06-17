import React from 'react'
import { Flex, Heading, Link, Text } from "@chakra-ui/react"


function NotFound() {
  
  
  return (
      <Flex flexDirection="column" justifyContent="center" alignItems="center"
            p="2rem">
          <Heading as="h2" size="lg" my="2rem">
            404 not Found
          </Heading>

          <Text my="2rem"> Sorry this web Page do not exist please click in the button bellow to login </Text>

          <Link href="/" p=".5rem" borderRadius="md" bg="blue.500" textColor="whiteAlpha.900"> 
            Back to Login 
          </Link>
      </Flex>
  );
}

export default NotFound
