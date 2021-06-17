import React from "react";
import { useToast } from "@chakra-ui/react"

const Toast = (props) => {
    const { msg, status } = props;

    const toast = useToast();

    return toast({
      title: msg,
      status: status,
      variant: "top-accent",
      position: "bottom-right", // "top-right"
      duration: 5000,
      isClosable: true,
    })
};

export default Toast;