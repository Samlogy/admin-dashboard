import React from 'react';
import { Link } from "react-router-dom";
import { useToast,
  Stat, StatLabel, StatNumber, StatHelpText, StatArrow, StatGroup,
  Stack, VStack,
  Text,
  Divider,
   } from "@chakra-ui/react"

import NavBar from "../../Components/NavBar/NavBar.jsx"
// import './style.css';


function Home() {

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

  // Components
  const displayStats = () => {
    return <StatGroup display="flex" flexDirection="row" flexWrap="wrap">
              <Stat border="1px" borderColor="gray.200" borderStyle="solid" borderRadius="md" 
                    w="15rem" m="1rem" p="1rem" shadow="md">
                <StatLabel> Users </StatLabel>
                <StatNumber>345,670</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  23.36%
                </StatHelpText>
              </Stat>
              
              <Stat border="1px" borderColor="gray.200" borderStyle="solid" borderRadius="md" 
                    w="15rem" m="1rem" p="1rem" shadow="md">
                <StatLabel> Products </StatLabel>
                <StatNumber>345,670</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  23.36%
                </StatHelpText>
              </Stat>

              <Stat border="1px" borderColor="gray.200" borderStyle="solid" borderRadius="md" 
                    w="15rem" m="1rem" p="1rem" shadow="md">
                <StatLabel> Newsletters </StatLabel>
                <StatNumber>345,670</StatNumber>
                <StatHelpText>
                  <StatArrow type="decrease" />
                  23.36%
                </StatHelpText>
              </Stat>

              <Stat border="1px" borderColor="gray.200" borderStyle="solid" borderRadius="md" 
                    w="15rem" m="1rem" p="1rem" shadow="md">
                <StatLabel> Sells </StatLabel>
                <StatNumber>345,670</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  23.36%
                </StatHelpText>
              </Stat>
            </StatGroup>
  };
  const displayChart = () => {
    return <Stack border="1px" borderColor="gray.200" borderStyle="solid" borderRadius="md" 
                  w="15rem" m="1rem" p="1rem" shadow="md">
                <Text> # 1 qsd;mqsdm </Text>  
          </Stack>
  };
  
  return (
    <>
      <NavBar />
      <div className="home-container">

        { displayStats() }
        
        <VStack>
          { displayChart() }
          <Divider colorScheme="blue.400" w="15rem" />

          { displayChart() }
          <Divider colorScheme="blue.400" w="15rem" />

          { displayChart() }
        </VStack>

      </div>
    </>
  );
}

export default Home
