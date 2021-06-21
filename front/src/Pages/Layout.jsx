import React from "react";
import { Flex } from "@chakra-ui/react";

import { NavBar } from "../Components"

const Layout = (props) => {
    // const { children, isFixedNav, isVisible, additonalStyle  } = props;
    // {...props.additonalStyle}
  return (
    <Flex flexDirection="column" minHeight="100%" w="100%" {...props.rest}>
      { (props.isVisible && props.isVisible) &&
        <NavBar isFixedNav={props.isFixedNav} />
      }

      <Flex alignItems="center" justifyContent="top" flexDirection="column"
            py={props.isFixedNav ? { md: "4rem" } : "0"}>

        {props.children && props.children}

      </Flex>
    </Flex>
  );
}

export default Layout;