import React from "react";
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent,  DrawerCloseButton,
  useColorModeValue,
  Text, Link,
   } from "@chakra-ui/react"
import { FaUsers, FaProductHunt, FaRegNewspaper } from "react-icons/fa"
import { ImStatsDots } from "react-icons/im"

import Logout from "../../Pages/Auth/Logout"

const THEMES = {
  light: {
    color: "black",
    bg: "white",
    colorHover: "black",
    bgHover: "gray.100"
  },
  dark: {
    color: "white",
    bg: "gray.700",
    colorHover: "white",
    bgHover: "gray.600"
  },
};

const SideBar = (props) => {
  const { onClose, isOpen } = props;

  const bgClrHover = useColorModeValue(THEMES.light.bgHover, THEMES.dark.bgHover);
  const bgClr = useColorModeValue(THEMES.light.bg, THEMES.dark.bg);

  // const clr = useColorModeValue(THEMES.light.color, THEMES.dark.color);
  // const clrHover = useColorModeValue(THEMES.light.colorHover, THEMES.dark.colorHover);

  return <Drawer placement="left" onClose={onClose && onClose} isOpen={isOpen && isOpen}  
                size="xs" p=".5rem"> 
            <DrawerOverlay />

            <DrawerContent>
              <DrawerCloseButton />

              <DrawerHeader borderBottomWidth="1px"> ADMIN PANEL </DrawerHeader>

              <DrawerBody display="flex" flexDirection="column" justifyContent="left" size="md" mt="2rem">
                <Link href="/home" display="flex" flexDirection="row" fontSize="15" justifyContent="left"
                      mb="1rem" p="1rem" borderRadius="md" bg={bgClr}
                      _hover={{ bg: bgClrHover, fontWeight: "medium"}} > 
                  <ImStatsDots size="24" />
                  <Text ml="1.5rem"> App Statistics </Text>
                </Link>

                <Link href="/users" display="flex" flexDirection="row" fontSize="15" justifyContent="left"
                      mb="1rem" p="1rem" borderRadius="md" bg={bgClr}
                      _hover={{ bg: bgClrHover, fontWeight: "medium"}}>
                  <FaUsers size="24" />
                  <Text ml="1.5rem"> User Manamgement </Text>
                </Link>

                <Link href="/products" display="flex" flexDirection="row" fontSize="15" justifyContent="left"
                      mb="1rem" p="1rem" borderRadius="md" bg={bgClr}
                      _hover={{ bg: bgClrHover, fontWeight: "medium"}} >
                <FaProductHunt size="24" />
                  <Text ml="1.5rem"> Product Manamgement </Text>
                </Link>

                <Link href="/newsletter" display="flex" flexDirection="row" fontSize="15" justifyContent="left"
                      mb="1rem" p="1rem" borderRadius="md" bg={bgClr}
                      _hover={{ bg: bgClrHover, fontWeight: "medium"}} > 
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