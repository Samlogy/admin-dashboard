import React, { useState } from "react";
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent,  DrawerCloseButton,
  useColorModeValue,
  Text, Box,
   } from "@chakra-ui/react";
import { useDispatch } from "react-redux";

import Logout from "../../Pages/Auth/Logout"
import SubList from "./SubList.jsx"
import { THEMES } from "../../utils/constants"
import { sideBarData } from "./sideBarData"
// import { setSideBarItem } from "../../store/actions/navBarActions"

const SideBar = (props) => {
  const { onClose, isOpen } = props;
  const [showList, setShowList] = useState({ state: false, id: null });

  const dispatch = useDispatch();

  const bgClrHover = useColorModeValue(THEMES.light.bgHover, THEMES.dark.bgHover);
  const bgClr = useColorModeValue(THEMES.light.bg, THEMES.dark.bg);  

  const handleList = (item) => {
    // show / hide subMenu (list)
    if (!showList.state) { // #1 click
      setShowList({ ...showList, state: true, id: item.id })
      return;
    } // #2 click
    setShowList({...showList, state: false, id: null })

    // update global store
    // dispatch(setSideBarItem(item))
  };

  return <Drawer placement="left" onClose={onClose && onClose} isOpen={isOpen && isOpen}  
                size="xs" p=".5rem"> 
            <DrawerOverlay />

            <DrawerContent>
              <DrawerCloseButton />

              <DrawerHeader borderBottomWidth="1px"> ADMIN PANEL </DrawerHeader>

              <DrawerBody display="flex" flexDirection="column" justifyContent="left" size="md" mt="2rem">
                { sideBarData.map((el, idx) => 
                    <>
                      <Box  display="flex" flexDirection="row" fontSize="15" justifyContent="left"
                            mb="1rem" p="1rem" borderRadius="md" bg={(showList.id === el.id) && bgClrHover}
                            _hover={{bg: bgClrHover, fontWeight: "medium"}}
                            onClick={() => handleList(el)}>
                          {el.icon}
                          <Text ml="1.5rem"> {el.label} </Text>
                      </Box>

                      {(showList.state && showList.id === el.id)  && <SubList data={el.subMenu} /> }
                    </>                   
                  )}
              </DrawerBody>

              <DrawerFooter display="flex" flexDirection="column" justifyContent="center">
                <Logout />
              </DrawerFooter>
            </DrawerContent>
            </Drawer>
};

export default SideBar;