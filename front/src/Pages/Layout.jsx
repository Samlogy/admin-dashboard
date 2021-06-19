import React from "react";
import { Flex } from "@chakra-ui/react";

import { NavBar } from "../Components/NavBar"

const Layout = (props) => {
    // const { children, isFixedNav  } = props;

  return (
    <Flex flexDirection="column" minHeight="100%" w="100%">
      <NavBar isFixedNav />

      <Flex alignItems="center" justifyContent="top" flexDirection="column"
            pt={props.isFixedNav ? { md: "4rem" } : "0"}>

        {props.children && props.children}

      </Flex>
    </Flex>
  );
}

export default Layout;

{/* <Layout isFixedNav>
    all components
</Layout> */}
