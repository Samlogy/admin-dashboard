import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { 
  Flex, Heading, Input, Button, InputGroup, Stack, InputLeftElement, chakra, Box, Avatar, FormControl, InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";

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

    const notifyUser = (data) => {
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
    
    const CFaUserAlt = chakra(FaUserAlt);
    const CFaLock = chakra(FaLock);
 
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
                notifyUser({msg: result.message, status: "success"})

                dispatch(logged({
                    logged: true,
                    userData: result.data
                })) 

                return history.push('/home')
            }
            notifyUser({msg: "An Error Occured during the sending process !", status: "error"})

        } catch (err) {
            notifyUser({msg: `Error: ${err.message}`, status: "error"})
        }

    };

  return  <div className="login-container">
            <Flex flexDirection="column" width="100wh" height="100vh"
                backgroundColor="gray.200" justifyContent="center" alignItems="center">
                <Stack flexDir="column" mb="2" justifyContent="center" alignItems="center">
                  <Avatar bg="blue.500" />
                  <Heading color="blue.400" my="auto"> Login </Heading>

                  <Box minW={{ base: "90%", md: "500px" }}>
                      <Stack borderRadius="md" spacing={4} p="2rem" backgroundColor="whiteAlpha.900" boxShadow="md">
                        <FormControl>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none" children={<CFaUserAlt color="gray.300" />} />
                            <Input type="email" placeholder="Email" value={auth.email} 
                                  onChange={(e) => setAuth({...auth, email: e.target.value})} />
                          </InputGroup>
                        </FormControl>

                        <FormControl>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none" color="gray.300" children={<CFaLock color="gray.300" />} />
                            <Input type={showPassword ? "text" : "password"} placeholder="Password" value={auth.password} 
                                  onChange={(e) => setAuth({...auth, password: e.target.value})} />

                            <InputRightElement width="4.5rem">
                              <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                                {showPassword ? "Hide" : "Show"}
                              </Button>
                            </InputRightElement>
                          </InputGroup>
                        </FormControl>

                        <Button borderRadius="md" type="submit" variant="solid" colorScheme="blue" onClick={() => onLogin()}>
                          Login
                        </Button>
                      </Stack>
                  </Box>
                </Stack>

              </Flex>
          </div>;
};

export default Login;
