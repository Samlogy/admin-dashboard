import React from "react";
import { Flex } from "@chakra-ui/react";

import { NavBar } from "../Components"
import { useSelector } from "react-redux";

const Layout = ({ isFixedNav, isVisible, children, ...rest}) => {
  
  const authStore = useSelector(state => state.auth); 

  return (
    <Flex flexDirection="column" minHeight="100%" w="100%" {...rest}>
      { (isVisible && isVisible) &&
        <NavBar isFixedNav={isFixedNav} 
                logo="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKJoJokT_Vv4P4I0xnp5AIum9cUf75992G4mgIwkZQW4IISttYo9SuYZQjhZm0XjcEX7o&usqp=CAU" 
                avatar={authStore && authStore.userData.avatar} 
                notifs={12}
                />
      }

      <Flex alignItems="center" justifyContent="top" flexDirection="column"
            py={isFixedNav ? { md: "4rem" } : "0"}>

        {children && children}

      </Flex>
    </Flex>
  );
}

export default Layout;