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

import Logout from "../../Pages/Auth/Logout"


const SideBar = (props) => {
  const { onClose, isOpen } = props;

  // console.log(isOpen)

  return <Drawer placement="left" onClose={onClose && onClose} isOpen={isOpen && isOpen}  
                size="xs" p=".5rem"> 
            <DrawerOverlay />

            <DrawerContent>
              <DrawerCloseButton />

              <DrawerHeader borderBottomWidth="1px"> ADMIN PANEL </DrawerHeader>

              <DrawerBody display="flex" flexDirection="column" justifyContent="left" size="md">
                <Link href="/home" display="flex" flexDirection="row" fontSize="15" justifyContent="center"
                      mb=".5rem" p=".5rem" borderRadius="md" bg="gray.300"> 
                  <AiOutlineUserAdd size="18" />
                  App Statistics
                </Link>

                <Link href="/users" display="flex" flexDirection="row" fontSize="15" justifyContent="center"
                      mb=".5rem" p="1rem" borderRadius="md" bg="gray.300"> 
                  <AiOutlineUserAdd size="18" />
                  User Manamgement 
                </Link>

                <Link href="/products" display="flex" flexDirection="row" fontSize="15" justifyContent="center"
                      mb=".5rem" p="1rem" borderRadius="md" bg="gray.300"> 
                < AiOutlineUserAdd size="18" />
                  Product Manamgement
                </Link>

                <Link href="/newsletter" display="flex" flexDirection="row" fontSize="15" justifyContent="center"
                      mb=".5rem" p="1rem" borderRadius="md" bg="gray.300"> 
                  <AiOutlineUserAdd size="18" />
                  Write Newsletter
                </Link>
              </DrawerBody>

              <DrawerFooter display="flex" flexDirection="column" justifyContent="center">
                <Logout />
              </DrawerFooter>
            </DrawerContent>
            </Drawer>
};

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
              <Button colorScheme="navItem" variant="ghost">
                <MdHome size="24" />
              </Button>

              <Button colorScheme="navItem" variant="ghost">
                { colorMode === "light" ? <BiMoon size="24" onClick={toggleColorMode} /> : <BiSun size="24" onClick={toggleColorMode} /> }
              </Button>

              <Button colorScheme="navItem" variant="ghost">
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

              <Stack direction={["column", "row"]} style={{ marginLeft: "auto" }}>
                <Menu>
                  <MenuButton as={Button} colorScheme="navItem" variant="ghost"
                              rightIcon={<Icon as={FaCog} color="navItem.500" />}>
                  </MenuButton>
                  <MenuList>
                    <MenuGroup title="Profile">
                      <MenuItem> My Profile </MenuItem>
                    </MenuGroup>

                    <MenuDivider />

                    <MenuGroup title="Help">
                      <MenuItem> Tech Support </MenuItem>
                    </MenuGroup>
                  </MenuList>
                </Menu>
              </Stack>
              <Logout />
          </Stack>
        </Box>
      <SideBar onClose={onClose} isOpen={isOpen} />
      </>
    );
};

export default NavBar