import React from "react";
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent,  DrawerCloseButton,
  Text, Link,
   } from "@chakra-ui/react"
import { FaUsers, FaProductHunt, FaRegNewspaper } from "react-icons/fa"
import { ImStatsDots } from "react-icons/im"

import Logout from "../../Pages/Auth/Logout"


const SideBar = (props) => {
  const { onClose, isOpen } = props;

  return <Drawer placement="left" onClose={onClose && onClose} isOpen={isOpen && isOpen}  
                size="xs" p=".5rem"> 
            <DrawerOverlay />

            <DrawerContent>
              <DrawerCloseButton />

              <DrawerHeader borderBottomWidth="1px"> ADMIN PANEL </DrawerHeader>

              <DrawerBody display="flex" flexDirection="column" justifyContent="left" size="md">
                <Link href="/home" display="flex" flexDirection="row" fontSize="15" justifyContent="left"
                      mb=".5rem" p="1rem" borderRadius="md" bg="gray.200"
                      _hover={{ bg: "gray.300", fontWeight: "medium"}} > 
                  <ImStatsDots size="24" />
                  <Text ml="1.5rem"> App Statistics </Text>
                </Link>

                <Link href="/users" display="flex" flexDirection="row" fontSize="15" justifyContent="left"
                      mb=".5rem" p="1rem" borderRadius="md" bg="gray.200"
                      _hover={{ bg: "gray.300", fontWeight: "medium"}} >
                  <FaUsers size="24" />
                  <Text ml="1.5rem"> User Manamgement </Text>
                </Link>

                <Link href="/products" display="flex" flexDirection="row" fontSize="15" justifyContent="left"
                      mb=".5rem" p="1rem" borderRadius="md" bg="gray.200"
                      _hover={{ bg: "gray.300", fontWeight: "medium"}} >
                <FaProductHunt size="24" />
                  <Text ml="1.5rem"> Product Manamgement </Text>
                </Link>

                <Link href="/newsletter" display="flex" flexDirection="row" fontSize="15" justifyContent="left"
                      mb=".5rem" p="1rem" borderRadius="md" bg="gray.200"
                      _hover={{ bg: "gray.300", fontWeight: "medium"}} > 
                  <FaRegNewspaper size="24" />
                  <Text ml="1.5rem"> Write Newsletter </Text>
                </Link>
              </DrawerBody>

              <DrawerFooter display="flex" flexDirection="column" justifyContent="center">
                <Logout />
              </DrawerFooter>
            </DrawerContent>
            </Drawer>
};

export default SideBar;