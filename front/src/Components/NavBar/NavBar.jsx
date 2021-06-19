import React from "react";
import { Box,  Link, Button,
  Image, Icon, Flex, Stack, Text, Avatar, Badge,
  useDisclosure, useColorMode
   } from "@chakra-ui/react"
import { MdNotificationsActive, MdHome, MdKeyboardArrowLeft } from "react-icons/md"
import { BiMoon, BiSun } from "react-icons/bi"

import SideBar from "./SideBar.jsx"
import SubMenu from "./SubMenu.jsx"
import Logout from "../../Pages/Auth/Logout"

const NavBar = (props) =>  {
    const { avatar, notifs, logo } = props;

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { colorMode, toggleColorMode } = useColorMode()


    // sub-menu data
    const menuData = [
      {
        title: "profile",
        items: ["My Profile"]
      },
      {
        title: "help",
        items: ["Tech Support"]
      }
    ];

    return (
      <>
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" bg="gray.200" p=".5rem">
          <Button colorScheme="blue" variant="outline">
            <MdKeyboardArrowLeft size="24" onClick={onOpen} />
          </Button>

          <Stack display="flex" flexDirection="row" alignItems="center">
            <Image boxSize="45px" fallbackSrc={logo && logo} borderRadius="md" mr=".5rem" />
            
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
                  <BiMoon size="24" onClick={toggleColorMode} /> : 
                  <BiSun size="24" onClick={toggleColorMode} /> 
                }
              </Button>

              <Button as="a" colorScheme="blue" variant="ghost" href="/notifications">
                { (notifs && notifs.length > 0) &&  
                  <Badge variant="solid" colorScheme="red" borderRadius="2xl"> 
                    {notifs.length > 99 ? "99+" : notifs.length}
                  </Badge> 
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

        <SideBar onClose={onClose} isOpen={isOpen} />
      </>
    );
};

export default NavBar