import React from "react";
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent,  DrawerCloseButton,
  useColorModeValue,
  Text, Link,
   } from "@chakra-ui/react"
import { FaUsers, FaProductHunt, FaRegNewspaper } from "react-icons/fa"
import { ImStatsDots } from "react-icons/im"
import { BiMessageSquareDetail } from "react-icons/bi"
import { BsInfoCircle } from "react-icons/bs"

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
const sideBarData = [
  {
    url: "/home",
    icon: <ImStatsDots size="24" />,
    label: "Analytics"
  },
  {
    url: "/users",
    icon: <FaUsers size="24" />,
    label: "Users Management"
  },
  {
    url: "/products",
    icon: <FaProductHunt size="24" />,
    label: "Products Management"
  },
  {
    url: "/newsletter",
    icon: <FaRegNewspaper size="24" />,
    label: "Write Newsletter"
  },
  {
    url: "/contacts",
    icon: <BiMessageSquareDetail size="24" />,
    label: "Contacts"
  },
  {
    url: "/reports",
    icon: <BsInfoCircle size="24" />,
    label: "Reports"
  },
];

const SideBar = (props) => {
  const { onClose, isOpen } = props;

  const bgClrHover = useColorModeValue(THEMES.light.bgHover, THEMES.dark.bgHover);
  const bgClr = useColorModeValue(THEMES.light.bg, THEMES.dark.bg);  

  return <Drawer placement="left" onClose={onClose && onClose} isOpen={isOpen && isOpen}  
                size="xs" p=".5rem"> 
            <DrawerOverlay />

            <DrawerContent>
              <DrawerCloseButton />

              <DrawerHeader borderBottomWidth="1px"> ADMIN PANEL </DrawerHeader>

              <DrawerBody display="flex" flexDirection="column" justifyContent="left" size="md" mt="2rem">
                { sideBarData.map((el, idx) => 
                    <Link href={el.url} display="flex" flexDirection="row" fontSize="15" justifyContent="left"
                          mb="1rem" p="1rem" borderRadius="md" bg={bgClr}
                          _hover={{ bg: bgClrHover, fontWeight: "medium"}} > 
                      {el.icon}
                      <Text ml="1.5rem"> {el.label} </Text>
                    </Link>
                  )}
              </DrawerBody>

              <DrawerFooter display="flex" flexDirection="column" justifyContent="center">
                <Logout />
              </DrawerFooter>
            </DrawerContent>
            </Drawer>
};

export default SideBar;