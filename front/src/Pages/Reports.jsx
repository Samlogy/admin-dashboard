import React from "react";
import { Flex, Heading, Container } from "@chakra-ui/react";

import Layout from "./Layout.jsx"

const Reports = () => {
    
  return (
    <Layout isFixedNav isVisible>
      <Container maxW="80em" py="39px" px={["16px","","","40px"]} m="0 auto" borderRadius="4px">
        <Heading as="h2" size="lg" textAlign="left" my="2rem"> Reports </Heading>
        </Container>
    </Layout>
  );
}

export default Reports;