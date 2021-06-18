import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, chakra } from "@chakra-ui/react"
import { BiExit} from "react-icons/bi"
// import { useToasts } from 'react-toast-notifications'

import { notLogged } from '../../_actions/authActions';
// import proxy from '../proxySetup'
// import "./style.css";

const proxy = "http://localhost:5000";

const Logout = () => {
  const [loggedOut, setLoggedOut] = useState(false);

  // const authStore = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const history = useHistory()
  // const { addToast } = useToasts()

  const CBiExit = chakra(BiExit)

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

        // addToast(result.message, { appearance: 'success', autoDismiss: false })
        return history.push('/')
      }
      // addToast('An error occured during logging out !', { appearance: 'error', autoDismiss: false })

    } catch (err) {
      // addToast(err.message, { appearance: 'error', autoDismiss: false })
    }
  }

  if ( loggedOut ) onLogout()

  return  <div className="logout-container">
              <IconButton colorScheme="blue" aria-label="logout" icon={<CBiExit />} 
                          border="2px" borderSolid="solid" borderColor="white.400" borderRadius="md" mr=".5rem"
                          onClick={() => setLoggedOut(true)} />
          </div>;
};

export default Logout;
