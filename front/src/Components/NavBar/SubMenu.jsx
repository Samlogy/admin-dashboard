import React from "react";
import { Button, Stack, Icon,
  Menu, MenuItem, MenuDivider, MenuGroup, MenuList, MenuButton,
   } from "@chakra-ui/react"

import { FaCog } from "react-icons/fa";

const SubMenu = () => {

    return(
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
    )
  }

  export default SubMenu;