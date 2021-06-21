import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import { useToast, useColorModeValue,
  Stat, StatLabel, StatNumber, StatHelpText, StatArrow, StatGroup,
  Stack, VStack,
  Text, Heading,
  Divider,
   } from "@chakra-ui/react"
import {Bar, Line, Doughnut, Pie} from 'react-chartjs-2';

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
const proxy = "http://localhost:5000";

function Home() {
  const [userData, setUserData] = useState([])

  const toast = useToast();
  const bgClrHover = useColorModeValue(THEMES.light.bgHover, THEMES.dark.bgHover);

  // Functions

  // API call
  const loadData = async () => {
    const url = `${proxy}`

    try {
        let res = await fetch(url)

        if (res.ok) {
          res = await res.json()
          setUserData(res)
          displayToast(res.message, 'success')
        }
        displayToast('Your stats Profile has been loaded', 'error')

    } catch (err) { 
      displayToast(err.message, 'error')
    }
  };
  
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
  const displayChart = (type, data, options) => {
      switch(type) {
      case 'pie': return displayPie(data, options);
      case 'line': return displayLine(data, options);
      case 'bars': return diplayBars(data, options);
      case 'doughnut': return displayDoughnut(data, options);
      default: break;
    }
  };

  // Charts
  const diplayBars = (data, options) => {
    return <Stack border="1px" borderColor="gray.200" borderStyle="solid" borderRadius="md" 
                  w="40rem" p="1rem" shadow="md" >
                  <Heading as="h3" size="md" textAlign="left"> le titre </Heading>
                  <Bar data={data} options={options} />
            </Stack>
  };
  const displayLine = (data, options) => {
    return  <Stack border="1px" borderColor="gray.200" borderStyle="solid" borderRadius="md" 
                    w="40rem" p="1rem" shadow="md" >
                <Heading as="h3" size="md" textAlign="left"> le titre </Heading>
                <Line data={data} options={options} />
            </Stack>
  };
  const displayDoughnut = (data, options) => {
    return  <Stack border="1px" borderColor="gray.200" borderStyle="solid" borderRadius="md" 
                    w="40rem" p="1rem" shadow="md" >
                <Heading as="h3" size="md" textAlign="left"> le titre </Heading>
                <Doughnut data={data} options={options} />
            </Stack>
  };
  const displayPie = (data, options) => {
    return  <Stack border="1px" borderColor="gray.200" borderStyle="solid" borderRadius="md" 
                    w="40rem" p="1rem" shadow="md" >
                <Heading as="h3" size="md" textAlign="left"> le titre </Heading>
                <Pie data={data} options={options} />
            </Stack>
  };

  const barsData = {
    labels: ['January', 'February', 'March',
             'April', 'May'],
    datasets: [
      {
        label: 'Rainfall',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: [65, 59, 80, 81, 56]
      }
    ]
  };
  const barsOptions = {
    title:{
      display:true,
      text:'Average Rainfall per month',
      fontSize:20
    },
    legend:{
      display:true,
      position:'right'
    }
  };
  
  const lineData = {
    labels: ['January', 'February', 'March',
             'April', 'May'],
    datasets: [
      {
        label: 'Rainfall',
        fill: false,
        lineTension: 0.5,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: [65, 59, 80, 81, 56]
      }
    ]
  };
  const lineOptions = {
    title:{
      display:true,
      text:'Average Rainfall per month',
      fontSize:20
    },
    legend:{
      display:true,
      position:'right'
    }
  };

  const pieData = {
    labels: ['January', 'February', 'March',
           'April', 'May'],
  datasets: [
    {
      label: 'Rainfall',
      backgroundColor: [
        '#B21F00',
        '#C9DE00',
        '#2FDE00',
        '#00A6B4',
        '#6800B4'
      ],
      hoverBackgroundColor: [
      '#501800',
      '#4B5000',
      '#175000',
      '#003350',
      '#35014F'
      ],
      data: [65, 59, 80, 81, 56]
    }
  ]
  };
  const pieOptions = {
    title:{
      display:true,
      text:'Average Rainfall per month',
      fontSize:20
    },
    legend:{
      display:true,
      position:'right'
    }
  };

  // useEffect(() => { 
  //     loadData() 
  // }, [])
  
  return (
      <Layout isFixedNav isVisible>
        <Heading as="h3" size="lg" textAlign="left" mt="1rem"> Statistics </Heading>
        { displayStats() }
        
        <VStack my="2rem">
          <Heading as="h3" size="lg" textAlign="left" mb="1rem"> Graphs </Heading>

          { displayChart("bars", barsData, barsOptions) }
          <hr style={{borderBottom:".15rem solid #2b6cb0", width: "15rem", margin: "2rem 0"}} />

          { displayChart("line", lineData, lineOptions) }
          <hr style={{borderBottom:".15rem solid #2b6cb0", width: "15rem", margin: "2rem 0"}} />

          { displayChart("doughnut", pieData, pieOptions) }
          <hr style={{borderBottom:".15rem solid #2b6cb0", width: "15rem", margin: "2rem 0"}} />

          { displayChart("pie", pieData, pieOptions) }
        </VStack>
      </Layout>
  );
}

export default Home
