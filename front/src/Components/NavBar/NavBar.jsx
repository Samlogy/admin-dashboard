import React from "react";
import { Box,  Link, Button,
  Image, Icon, Flex, Stack, Text, Avatar, Badge,
  useDisclosure, useColorMode, useColorModeValue
   } from "@chakra-ui/react"
import { MdNotificationsActive, MdHome, MdKeyboardArrowLeft } from "react-icons/md"
import { BiMoon, BiSun } from "react-icons/bi"

import SideBar from "./SideBar.jsx"
import SubMenu from "./SubMenu.jsx"
import Logout from "../../Pages/Auth/Logout"
import { THEMES } from "../../utils/constants"
import { menuData } from "./sideBarData"


const NavBar = ({ avatar, notifs, logo, isFixedNav }) =>  {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { colorMode, toggleColorMode } = useColorMode()
    const btnRef = React.useRef()

    const bgClr = useColorModeValue(THEMES.light.bg, THEMES.dark.bg);

    return (
      <>
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" 
            p=".5rem" bg={bgClr} boxShadow="md" width="100%" pos={isFixedNav ? "fixed" : "inherit"}
            zIndex="999">

          <Button colorScheme="blue" variant="outline" ref={btnRef}>
            <MdKeyboardArrowLeft size="24" onClick={onOpen} />
          </Button>

          <Stack display="flex" flexDirection="row" alignItems="center">
            <Image boxSize="45px" borderRadius="md" mr=".5rem" src={logo && logo} 
                    fallbackSrc="https://via.placeholder.com/150"  />
            
            <Text fontSize="lg" fontWeight="500">
              ADMIN Panel
            </Text>
          </Stack>

          <Stack direction={["column", "row"]} alignItems={["flex-end", "center"]}>
              <Button as="a" colorScheme="blue" variant="ghost" href="/home">
                <MdHome size="24" />
              </Button>

              <Button colorScheme="blue" variant="ghost">
                { colorMode === "light" ? 
                  <BiMoon size="24" onClick={() => toggleColorMode(colorMode)} /> : 
                  <BiSun size="24" onClick={() => toggleColorMode(colorMode)} /> 
                }
              </Button>

              <Button as="a" colorScheme="blue" variant="ghost" href="/notifications">
                { notifs ?  
                  <Badge variant="solid" colorScheme="red" borderRadius="2xl"> 
                    {notifs > 99 ? "99+" : notifs}
                  </Badge> : ""
                }
                <MdNotificationsActive size="24" />
              </Button>

              <Button colorScheme="blue" variant="ghost">
                <Avatar name="admin" src={avatar && avatar} size="sm" />
              </Button>

              <SubMenu color="blue.500" menuData={menuData} />
              <Logout />
          </Stack>
        </Box>

        <SideBar onClose={onClose} isOpen={isOpen} btnRef={btnRef} />
      </>
    );
};

export default NavBar