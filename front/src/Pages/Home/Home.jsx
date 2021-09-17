import React, {useState, useEffect} from 'react';
import { useToast, useColorModeValue, VStack, Heading, Stack, Container, Flex } from "@chakra-ui/react"

import Layout from "../Layout.jsx"
import Stats from './Stats.jsx';
import Chart from "./Chart.jsx";

import { THEMES } from "../../utils/constants"
import { Toast } from "../../Components"


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
  const [data, setData] = useState([])

  const toast = useToast();

  const bgClrHover = useColorModeValue(THEMES.light.bgHover, THEMES.dark.bgHover);

  // API call
  const onLoad = async () => {

  };
  
  // Components

  // charts data
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
    maintainAspectRatio: false,
    plugins: {
      title: { // title
        display: true,
        text: 'Average Rainfall per month',
        padding: {
            top: 10,
            bottom: 30
        }
      },
      subtitle: { // subtitle
        display: true,
        text: 'Subtitle Rainfall'
      },
      legend: { // legend
        display: true,
        labels: {
            color: '#111'
        }
      }
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
    maintainAspectRatio: false,
    plugins: {
      title: { // title
        display: true,
        text: 'Average Rainfall per month',
        padding: {
            top: 10,
            bottom: 30
        }
      },
      subtitle: { // subtitle
        display: true,
        text: 'Subtitle Rainfall'
      },
      legend: { // legend
        display: true,
        labels: {
            color: '#111'
        }
      }
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
    maintainAspectRatio: false,
    plugins: {
      title: { // title
        display: true,
        text: 'Average Rainfall per month',
        padding: {
            top: 10,
            bottom: 30
        }
      },
      subtitle: { // subtitle
        display: true,
        text: 'Subtitle Rainfall'
      },
      legend: { // legend
        display: true,
        labels: {
            color: '#111'
        }
      }
    }
  };

  // useEffect(() => { 
  //     onLoad() 
  // }, [])
  
  return (
      <Layout isFixedNav isVisible px="1rem">
        <Container maxW="80em" bg="white" py="39px" px={["16px","","","40px"]} m="0 auto" borderRadius="4px">
          <Heading as="h3" size="lg" textAlign="left" mt="1rem"> Statistics </Heading>
          <Stats data={appStats} />
          
          <VStack my="2rem">
            <Heading as="h3" size="lg" textAlign="left" mb="1rem"> Graphs </Heading>

            <Flex flexDir="row" flexWrap="wrap" justifyContent="space-evenly" alignItems="flex-end">
              <Chart type="bars" data={barsData} options={barsOptions} title={'title 1'} />
              <Chart type="line" data={lineData} options={lineOptions} title={'title 2'} />
              <Chart type="doughnut" data={pieData} options={pieOptions} title={'title 3'} />
              <Chart type="pie" data={pieData} options={pieOptions} title={'title 4'} />
            </Flex>
          </VStack>
        </Container>
      </Layout>
  );
}

export default Home
