import React from 'react'
import { Stack, Heading, Text } from "@chakra-ui/react";
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';

const ChartTemplate = ({ children }) => {
    return(
        <Stack border="1px solid" borderColor="gray.200" borderRadius="md" 
                w="40rem" maxH="22.5rem" p="1rem" shadow="md" mb="2rem">
            {children}            
        </Stack>
    )
}

function Chart({ type, data, options }) {

    return(
        type === "pie" ? <ChartTemplate> <Pie data={data} options={options} /> </ChartTemplate> :
        type === "line" ? <ChartTemplate> <Line data={data} options={options} /> </ChartTemplate> :
        type === "bars" ? <ChartTemplate> <Bar data={data} options={options} /> </ChartTemplate> :
        type === "doughnut" ? <ChartTemplate> <Doughnut data={data} options={options} /> </ChartTemplate> : 
        <Text> This chart do not exist ! </Text>
    )
}

export default Chart