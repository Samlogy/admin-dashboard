import React, { useRef } from "react";
import { AiOutlineUserAdd } from "react-icons/ai"
import { Box,  Link, Button,
  Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent,  DrawerCloseButton,
  Menu, MenuItem, MenuDivider, MenuGroup, MenuList, MenuButton, 
  Image, Icon, Flex, Stack, Text, Avatar, Badge,
  useDisclosure, useColorMode
   } from "@chakra-ui/react"

import { FaCog } from "react-icons/fa";
import { MdNotificationsActive, MdHome, MdKeyboardArrowLeft } from "react-icons/md"
import { BiMoon, BiSun } from "react-icons/bi"

import { FaUsers, FaProductHunt, FaRegNewspaper } from "react-icons/fa"
import { ImStatsDots } from "react-icons/im"

import SideBar from "./SideBar.jsx"
import SubMenu from "./SubMenu.jsx"
import Logout from "../../Pages/Auth/Logout"

const NavBar = (props) =>  {
    const { avatar, notifs, logo } = props;

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { colorMode, toggleColorMode } = useColorMode()

    return (
      <>
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" bg="gray.200" p=".5rem">
          <Button colorScheme="navItem" variant="outline" colorScheme="blue">
            <MdKeyboardArrowLeft size="24" onClick={onOpen} />
          </Button>

          <Stack display="flex" flexDirection="row" alignItems="center">
            <Image boxSize="45px" fallbackSrc={logo && logo} borderRadius="md" mr=".5rem" />
            
            <Text fontSize="lg" fontWeight="500">
              ADMIN Panel
            </Text>
          </Stack>

          <Stack direction={["column", "row"]} alignItems={["flex-end", "center"]}>
              <Button as="a" colorScheme="navItem" variant="ghost" href="/home">
                <MdHome size="24" />
              </Button>

              <Button colorScheme="navItem" variant="ghost">
                { colorMode === "light" ? <BiMoon size="24" onClick={toggleColorMode} /> : <BiSun size="24" onClick={toggleColorMode} /> }
              </Button>

              <Button as="a" colorScheme="navItem" variant="ghost" href="/notifications">
                { (notifs && notifs.length > 0) &&  
                  <Badge variant="solid" colorScheme="red" borderRadius="2xl"> 
                    {notifs.length > 99 ? "99+" : notifs.length}
                  </Badge> 
                }
                <MdNotificationsActive size="24" />
              </Button>

              <Button colorScheme="navItem" variant="ghost">
                <Avatar name="admin" src={avatar && avatar} size="sm" />
              </Button>

              <SubMenu />
              <Logout />
          </Stack>
        </Box>
      <SideBar onClose={onClose} isOpen={isOpen} />
      </>
    );
};

export default NavBar