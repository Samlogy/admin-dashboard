import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { IconButton, chakra, useToast } from "@chakra-ui/react"
import { BiExit} from "react-icons/bi"

import { notLogged } from '../../_actions/authActions';
// import proxy from '../proxySetup'

const proxy = "http://localhost:5000";

const Logout = () => {
  const [loggedOut, setLoggedOut] = useState(false);

  const dispatch = useDispatch()
  const history = useHistory()
  const toast = useToast();

  const CBiExit = chakra(BiExit)

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

  const onLogout = async () => {
    const url = `${proxy}/admin/auth/logout`

    try {
      const res = await fetch(url)

      if (res.ok) {
        const result = await res.json()

        dispatch(notLogged({
          logged: false,
          userData: {},
        }))

        displayToast({ msg: result.message, status: "success" })
        return history.push('/')
      }
      displayToast({ msg: 'An error occured during logging out !', status: "error" })

    } catch (err) {
      displayToast({ msg: err.message, status: "error" })
    }
  };

  if ( loggedOut ) onLogout()

  return  <IconButton colorScheme="blue" variant="solid" aria-label="logout" mr="1rem" 
                      icon={<CBiExit size="20" />} onClick={() => setLoggedOut(true)} />
};

export default Logout;
