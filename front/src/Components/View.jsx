import React from "react";
import { Box } from "@chakra-ui/react"

const View = ({ children, ...rest }) => {
    if(rest.if) 
        return(
            <Box {...rest}>
                { children }
            </Box>
        )
    else return null;
}

export default View;