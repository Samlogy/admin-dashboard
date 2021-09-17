import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { Heading, Input, Button, FormControl, Stack, Box, InputRightElement, InputGroup, FormLabel,
  useToast, useColorModeValue } from "@chakra-ui/react";
  
import Layout from "../Layout.jsx"
import { logged } from '../../store/actions/authActions';
import { login } from "../../api"


const Login = () => {
  const [auth, setAuth] = useState({ email: "", password: "", checked: true })
  const [showPassword, setShowPassword] = useState(false);
    
    const dispatch = useDispatch()
    const history = useHistory()
    const toast = useToast();

    const handleShowClick = () => {
      setShowPassword(!showPassword);
    };
 
    const onLogin = async () => {
        if (auth.checked) delete auth.checked
        const result = await login(auth);

        if (result.success) {
          displayToast({ msg: result.message, status: "success" })
          dispatch(logged({
            isLogged: true,
            userData: result.data
          }))
          return history.push('/home');
        }
        displayToast({msg: result.error, status: "error"})
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
    
  return    <Layout>
              <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6} minH="100vh" display="flex" justifyContent="center" alignItems="center">
                <Stack align={'center'}>
                  <Heading fontSize={'4xl'}> Sign In </Heading>
                </Stack>
       
                <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8} w="500px">
                  <Stack spacing={4}>
                    <FormControl id="email">
                      <FormLabel> Email </FormLabel>
                      <Input type="email" placeholder="Email" value={auth.email}
                                  onChange={(e) => setAuth({...auth, email: e.target.value})} />
                    </FormControl>

                    <FormControl id="password">
                    <FormLabel> Password </FormLabel>
                      <InputGroup>
                        <Input type={showPassword ? "text" : "password"} placeholder="Password" value={auth.password} 
                                    onChange={(e) => setAuth({...auth, password: e.target.value})} />
                        <InputRightElement width="4.5rem">

                          <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                            {showPassword ? "Hide" : "Show"}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                    

                    <Stack spacing={10}>
                      <Button bg={'blue.400'} borderRadius="md" color={'white'} _hover={{ bg: 'blue.500', }} onClick={() => onLogin()}>
                        Sign In
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </Layout>
};

export default Login;
