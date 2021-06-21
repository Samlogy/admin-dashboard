import React from 'react';
import { Link } from "react-router-dom";
import { useToast, useColorModeValue,
  Stat, StatLabel, StatNumber, StatHelpText, StatArrow, StatGroup,
  Stack, VStack,
  Text, Heading ,
  Divider,
   } from "@chakra-ui/react"

import Layout from "../Layout.jsx"

const THEMES = {
  light: {
    color: "black",
    bg: "white",
    colorHover: "black",
    bgHover: "gray.100"
  },
  dark: {
    color: "white",
    bg: "gray.700",
    colorHover: "white",
    bgHover: "gray.600"
  },
};
const appStats = [
  {
    label: "Users",
    number: 345.670,
    arrowType: "increase",
    percent: "23.36%",
  },
  {
    label: "Products",
    number: 345.670,
    arrowType: "increase",
    percent: "23.36%",
  },
  {
    label: "Newsletters",
    number: 345.670,
    arrowType: "decrease",
    percent: "23.36%",
  },
  {
    label: "Sells",
    number: 345.670,
    arrowType: "increase",
    percent: "23.36%",
  },
];

function Home() {

  const toast = useToast();
  const bgClrHover = useColorModeValue(THEMES.light.bgHover, THEMES.dark.bgHover);
  
  // Components
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
  const displayStats = () => {
    return <StatGroup display="flex" flexDirection="row" flexWrap="wrap" my="1rem">
              { appStats.map((el, idx) => 
                  <Stat border="1px" borderColor="gray.200" borderStyle="solid" borderRadius="md"
                        w="15rem" m="1rem" p="1rem" shadow="md" _hover={{bg: bgClrHover}}>
                    <StatLabel fontSize="1.1rem"> {el.label} </StatLabel>
                    <StatNumber> {el.number} </StatNumber>
                    <StatHelpText>
                      <StatArrow type={el.arrowType} />
                      {el.percent}
                    </StatHelpText>
                  </Stat>
                )
              }
            </StatGroup>
  };
  const displayChart = () => {
    return <Stack border="1px" borderColor="gray.200" borderStyle="solid" borderRadius="md" 
                  w="15rem" p="1rem" shadow="md">
                  <Heading as="h2" size="lg" mb="1rem">I'm a Heading</Heading>

                <Text> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cum impedit vel quidem quam molestias aut dolorum molestiae beatae inventore odit vitae accusamus labore, architecto ad quia nihil ducimus accusantium maiores. </Text>  
          </Stack>
  };
  
  return (
      <Layout isFixedNav isVisible>
        { displayStats() }
        
        <VStack my="2rem">
          { displayChart() }
          <Divider w="15rem" border="1px" borderColor="blue.500" borderStyle="solid" />

          { displayChart() }
          <Divider w="15rem" border="1px" borderColor="blue.500" borderStyle="solid" />

          { displayChart() }
        </VStack>
      </Layout>
  );
}

export default Home
