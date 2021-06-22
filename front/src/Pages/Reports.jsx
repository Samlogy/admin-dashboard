import React from "react";
import { Flex, Heading } from "@chakra-ui/react";

import Layout from "./Layout.jsx"

const Reports = () => {
    
  return (
    <Layout isFixedNav isVisible>
        <Heading as="h2" size="lg" textAlign="left" my="2rem"> Reports </Heading>
    </Layout>
  );
}

export default Reports;