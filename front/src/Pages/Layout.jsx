import React, {useEffect, useState} from "react";
import { Flex, useToast } from "@chakra-ui/react";

import { NavBar } from "../Components"
import { useSelector } from "react-redux";

import { load_notifications } from "../api"

const Layout = ({ isFixedNav, isVisible, children, ...rest}) => {
  const [notifs, setNotifs] = useState({ loading: false, numbers: 0 });

  const authStore = useSelector(state => state.auth); 
  const toast = useToast();

  const onLoad = async () => {
    setNotifs({...notifs, loading: true })
    const userId = authStore.userData._id
    const result = await load_notifications(userId);

    if (result.success) {
      // set state
      setNotifs({
        loading: false,
        numbers: result.data.length
      })
      return;
    }
    setNotifs({...notifs, loading: false })
    displayToast({ msg: "Error occured while loading User Notification !", status: "error" })
  };

  const displayToast = (data) => {
    const { msg, status } = data
    return toast({
      title: msg,
      status: status,
      variant: "top-accent",
      position: "bottom-right", // "top-right"
      duration: 5000,
      isClosable: true,
    })
  };

  useEffect(() => {
    onLoad()
  }, [])

  return (
    <Flex flexDirection="column" minHeight="100%" w="100%" {...rest}>
      { isVisible &&
        <NavBar isFixedNav={isFixedNav} 
                logo="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKJoJokT_Vv4P4I0xnp5AIum9cUf75992G4mgIwkZQW4IISttYo9SuYZQjhZm0XjcEX7o&usqp=CAU" 
                avatar={authStore && authStore.userData.avatar} 
                notifs={notifs.numbers}
                />
      }

      <Flex alignItems="center" justifyContent="top" flexDirection="column"
            py={isFixedNav ? { md: "4rem" } : "0"}>

        {children}

      </Flex>
    </Flex>
  );
}

export default Layout;