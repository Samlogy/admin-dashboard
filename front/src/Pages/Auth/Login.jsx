import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { 
  Flex, Heading, Input, Button, FormControl, Stack, Box, InputRightElement, InputGroup,
  useToast,
  FormLabel, useColorModeValue, 
} from "@chakra-ui/react";


// import proxy from '../../proxySetup'
// import { loginSchema } from '../../data_validation/index'
import { logged } from '../../_actions/authActions'


const proxy = "http://localhost:5000";


const Login = () => {
  const [auth, setAuth] = useState({ email: "", password: "", checked: true })
  const [showPassword, setShowPassword] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);
    
    const dispatch = useDispatch()
    const history = useHistory()
    const toast = useToast();

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
 
    const onLogin = async () => {
        const url = `${proxy}/admin/auth/login`

        if (auth.checked) delete auth.checked

        try {
            // const valid = await loginSchema.validate({ ...auth })
            const res = await fetch(url, { 
                headers: { 
                    'Content-Type': 'application/json' 
                },
                method: "POST", 
                body: JSON.stringify(auth)
            })
           
            if (res.ok) {
                const result = await res.json()
                displayToast({msg: result.message, status: "success"})

                dispatch(logged({
                    logged: true,
                    userData: result.data
                })) 

                return history.push('/home')
            }
            displayToast({msg: "An Error Occured during the sending process !", status: "error"})

        } catch (err) {
            displayToast({msg: `Error: ${err.message}`, status: "error"})
        }

    };

  return    <Flex minH={'100vh'} align={'center'} justify={'center'} >
              <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
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
            </Flex>
};

export default Login;
