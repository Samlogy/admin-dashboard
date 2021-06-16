import React from 'react';
import { Link } from "react-router-dom";
import { useToast  } from "@chakra-ui/react"

import TopBar from "../../Components/TopBar/TopBar"
import SideBar from "../../Components/SideBar/SideBar"
// import './style.css';


function Home() {

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

  return (
    <>
    <TopBar />
      <div className="home-container">
          
      
      </div>
    <SideBar />
    </>
  );
}

export default Home
