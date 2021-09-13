import React from "react";
import { Button, Stack, Icon, Menu, MenuItem, MenuGroup, MenuList, MenuButton } from "@chakra-ui/react"
import { FaCog } from "react-icons/fa";


const SubMenu = (props) => {
  const { color, menuData } = props
    return(
      <Stack direction={["column", "row"]} style={{ marginLeft: "auto" }}>
        <Menu>
          <MenuButton as={Button} variant="ghost"
                      rightIcon={<Icon as={FaCog} color={color && color} />}>
          </MenuButton>
          <MenuList>
          { menuData && menuData.map((el, idx) => 
              <MenuGroup title={menuData.title}>
               { el.items.map((e, subIdx) => <MenuItem> {e} </MenuItem>) }
              </MenuGroup>
            )
          }
          </MenuList>
        </Menu>
      </Stack>
    )
  }

  export default SubMenu;