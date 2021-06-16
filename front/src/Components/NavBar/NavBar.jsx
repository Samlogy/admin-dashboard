import React, { useRef } from "react";
// import { BiBlock, BiTrash, BiPencil, BiDetail, BiUser } from "react-icons/bi"
import { AiOutlineUserAdd } from "react-icons/ai"
import { Box,  Link,
  Button, useDisclosure,
  Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent,  DrawerCloseButton,
   } from "@chakra-ui/react"

const NavBar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
  
    const firstField = useRef()
  
    return <> 
            <Box bg="gray.300" h={16}>
              <Button colorScheme="blue" onClick={onOpen}> Open </Button>
            </Box>
  
            <Drawer placement="left" onClose={onClose} isOpen={isOpen} initialFocusRef={firstField} 
                    size="xs" p=".5rem"> 
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader borderBottomWidth="1px"> ADMIN PANEL </DrawerHeader>
  
                <DrawerBody display="flex" flexDirection="column" justifyContent="left" size="md">
                  <Link href="/home" display="flex" flexDirection="row" fontSize="15" justifyContent="center"
                        mb=".5rem" p="1rem" borderRadius="md"> 
                    <AiOutlineUserAdd size="18" />
                    App Statistics
                  </Link>
  
                  <Link href="/manageUser" display="flex" flexDirection="row" fontSize="15" justifyContent="center"
                        mb=".5rem" p="1rem" borderRadius="md"> 
                    <AiOutlineUserAdd size="18" />
                    User Manamgement 
                  </Link>
  
                  <Link href="/products" display="flex" flexDirection="row" fontSize="15" justifyContent="center"
                        mb=".5rem" p="1rem" borderRadius="md"> 
                  < AiOutlineUserAdd size="18" />
                    Product Manamgement
                  </Link>
  
                  <Link href="/writeNewsletter" display="flex" flexDirection="row" fontSize="15" justifyContent="center"
                        mb=".5rem" p="1rem" borderRadius="md"> 
                    <AiOutlineUserAdd size="18" />
                    Write Newsletter
                  </Link>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </>
  };

export default NavBar