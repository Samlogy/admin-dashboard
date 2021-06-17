import React, { useRef } from "react";
// import { BiBlock, BiTrash, BiPencil, BiDetail, BiUser } from "react-icons/bi"
import { AiOutlineUserAdd } from "react-icons/ai"
import { Box,  Link,
  Button, useDisclosure,
  Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent,  DrawerCloseButton,
  Menu,
  MenuItem,
  MenuDivider,
  MenuGroup,
  MenuList,
  MenuButton, Container, Image, Icon, Flex, Stack, Text, Avatar, Badge 
   } from "@chakra-ui/react"

import { FaCog, FaChevronDown } from "react-icons/fa";
import { MdNotificationsActive, MdHome, MdKeyboardArrowLeft } from "react-icons/md"

import Logout from "../../Pages/Auth/Logout"

// const tt = () => {
//     const { isOpen, onOpen, onClose } = useDisclosure()
  
//     const firstField = useRef()
  
//     return <> 
//             <Box bg="gray.300" h={16}>
//               <Button colorScheme="blue" onClick={onOpen}> Open </Button>
//             </Box>
  
//             <Drawer placement="left" onClose={onClose} isOpen={isOpen} initialFocusRef={firstField} 
//                     size="xs" p=".5rem"> 
//               <DrawerOverlay />
//               <DrawerContent>
//                 <DrawerCloseButton />
//                 <DrawerHeader borderBottomWidth="1px"> ADMIN PANEL </DrawerHeader>
  
//                 <DrawerBody display="flex" flexDirection="column" justifyContent="left" size="md">
//                   <Link href="/home" display="flex" flexDirection="row" fontSize="15" justifyContent="center"
//                         mb=".5rem" p=".5rem" borderRadius="md" bg="gray.300"> 
//                     <AiOutlineUserAdd size="18" />
//                     App Statistics
//                   </Link>
  
//                   <Link href="/users" display="flex" flexDirection="row" fontSize="15" justifyContent="center"
//                         mb=".5rem" p="1rem" borderRadius="md" bg="gray.300"> 
//                     <AiOutlineUserAdd size="18" />
//                     User Manamgement 
//                   </Link>
  
//                   <Link href="/products" display="flex" flexDirection="row" fontSize="15" justifyContent="center"
//                         mb=".5rem" p="1rem" borderRadius="md" bg="gray.300"> 
//                   < AiOutlineUserAdd size="18" />
//                     Product Manamgement
//                   </Link>
  
//                   <Link href="/newsletter" display="flex" flexDirection="row" fontSize="15" justifyContent="center"
//                         mb=".5rem" p="1rem" borderRadius="md" bg="gray.300"> 
//                     <AiOutlineUserAdd size="18" />
//                     Write Newsletter
//                   </Link>
//                 </DrawerBody>

//                 <DrawerFooter display="flex" flexDirection="column" justifyContent="center">
//                   <Logout />
//                 </DrawerFooter>
//               </DrawerContent>
//             </Drawer>
//           </>
//   };
  const NavBar = (props) =>  {
     const { avatar, notifs, logo } = props;

    return (
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" bg="gray.200" p=".5rem">
          <Button colorScheme="navItem" variant="outline" colorScheme="blue">
            <MdKeyboardArrowLeft size="24" />
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
    );
  }

export default NavBar