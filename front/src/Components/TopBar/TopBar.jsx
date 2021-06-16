import React from "react";
import {
  Box,
  Stack,
  Heading,
  Flex,
  Text,
  useDisclosure,
  Avatar,
} from "@chakra-ui/react";
import { GiHamburgerMenu} from "react-icons/gi"

import Logout from "../../Pages/Auth/Logout"

const TopBar = (props) => {
  const avatar = props.avatar
  const notifs = props.notifs

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleToggle = () => (isOpen ? onClose() : onOpen());

  return (
    <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding="1rem" bg="blue.500" {...props}>
      <Flex align="center" mr={5} color="#fefefe">
        <Heading as="h1" size="lg" letterSpacing={"tighter"}>
          Logo
        </Heading>
      </Flex>

      <Box display={{ base: "block", md: "none" }} onClick={handleToggle}>
        <GiHamburgerMenu color="white" size="24px" />
      </Box>

      <Stack direction={{ base: "column", md: "row" }} color="#fefefe"
              display={{ base: isOpen ? "block" : "none", md: "flex" }}
              width={{ base: "full", md: "auto" }}
              alignItems="center" flexGrow={1} mt={{ base: 4, md: 0 }}>
        
        <Box>
          notif Icon
          { (notifs && notifs.length > 0) &&
                <span className="topIconBadge"> {notifs.length} </span>
          } 
        </Box>
        <Box>
          user settings
          { (notifs && notifs.length > 0) &&
                <span className="topIconBadge"> {notifs.length} </span>
          } 
        </Box>
      </Stack>

      <Box display={{ base: isOpen ? "flex" : "none", md: "flex" }} mt={{ base: 4, md: 0 }}>
        <Logout />
        <Avatar name="avatar image" src={avatar && avatar} size="md" />        
      </Box>
    </Flex>
  );
};

export default TopBar;
