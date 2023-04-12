import React, { useEffect } from 'react'
import {Box, Container, Text, Tabs, TabList, TabPanels, Tab, TabPanel} from "@chakra-ui/react"
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'
import { useNavigate } from 'react-router-dom'
import ForgetPassword from '../components/Authentication/ForgetPassword'

const Homepage = () => {
  const Navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));  // fetch the local storage
    if(user){
      Navigate("/chats");
    }
  }, [Navigate]);

  return (
    // Container helps us to keep our app very responsive in a different different screen sizes 
    <Container maxW="xl" centerContent>  
    {/* we are using a box instead of div */}
    <Box
    display= "flex"
    justifyContent="center"
    padding={3}
    backgroundColor= "white"
    width="100%"
    margin= "40px 0 15px 0"
    borderRadius= "lg"
    borderWidth= "1px"
    >  
      <Text fontSize="4xl" fontFamily="Work sans" color="black">Chat-A-Verse</Text>
    </Box>

    <Box bgColor="white" p={4}  width="100%" borderRadius="lg" borderWidth="1px">
    <Tabs variant='soft-rounded' >
  <TabList marginBottom= "1em">
    <Tab width="50%">Login</Tab>
    <Tab width="50%">Sign Up</Tab>
    <Tab width="50%">Forgot Password</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
    {/* Login */}
    <Login />
    </TabPanel>
    <TabPanel>
      {/* Sign Up */}
    <Signup />
    </TabPanel>
    <TabPanel>
      {/* Forgot Password */}
    <ForgetPassword />
    </TabPanel>
  </TabPanels>
</Tabs>
    </Box>
    </Container>
  )
}

export default Homepage