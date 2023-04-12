import { Button, FormControl, FormLabel, Input, VStack, useToast, Box, InputGroup, InputRightElement } from '@chakra-ui/react'
import axios from 'axios';
import React, { useContext, useState } from 'react'
import InstructionModal from '../InstructionModal';
import {ChatContext} from '../../Context/ChatProvider';

const ForgetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [show, setShow] = useState(false);
  const [token, setToken] = useState();
  const toast = useToast();
  const {email, setEmail} = useContext(ChatContext);

  const handleClick = () => setShow(!show);

  const Password_forgotten = async (email) => {
    setLoading(true);
    if(!email){
      toast({
        title : "Please enter your email",
        status : "warning",
        duration : 5000,  // 5 sec
        isClosable : true,
        position : 'bottom', 
    });
    setLoading(false);
    return;
    }

    try {
      const config = {
        headers : {
          "Content-type" : "application/json"
        },
      };
      const {data} = await axios.post("/api/user/forgetpassword", {email}, config);
      toast({
        title : `Reset Token Send to ${email}`,
        status : "success",
        duration : 5000,  // 5 sec
        isClosable : true,
        position : 'bottom', 
      })
      setShowResetForm(true);  // set state to show reset password form
      setLoading(false)
      // Navigate(`/resetpassword/${token}`);
      return;

    } catch (error) {
      toast({
        // title : "Error Occured !",
        description : error.response.data.message,
        status : "error",
        duration : 5000,  // 5 sec
        isClosable : true,
        position : 'bottom', 
    });
    setLoading(false);
    }
  };

const resetPassword = async (token, password) => {

  setLoading(true);
  try {
  const config = {
    headers : {
      "Content-type" : "application/json"
    },
  };
  
  const {data} = await axios.put(`/api/user/resetpassword`, {password,token}, config);

  toast({
    title : "Password Reset Successfully",
    status : "success",
    duration : 5000,  // 5 sec
    isClosable : true,
    position : 'bottom', 
});

setTimeout(() => {
  window.location.reload(); // Reload the page after successful password reset
}, 3000); // 3 seconds

setLoading(false);

} catch (error) {
  toast({
    title : "Error Occured !",
    description : error.response.data.message,
    status : "error",
    duration : 5000,  // 5 sec
    isClosable : true,
    position : 'bottom', 
});
setLoading(false);
return;
}}

  const submitEmailHandler = (e) => {
    e.preventDefault();
    Password_forgotten(email);

  };

  const submitResetHandler = (e) => {
    e.preventDefault();
    resetPassword(token,password);
  }

  return (
      <Box>

    <VStack spacing="5px">
    {!showResetForm ? (
      <>
    <FormControl isRequired id='email'>
      <FormLabel>Email</FormLabel>
      <Input
      placeholder='Enter Your Email Again'
      value={email}
      onChange={(e) => setEmail(e.target.value)}
       />
    </FormControl>

    <Button 
    colorScheme='yellow'
    width="100%"
    style={{marginTop : 15}}
    isLoading={loading}
    onClick={submitEmailHandler}
    >
    Send Reset Password Link
    </Button>
      </>
      ) : (
        <>

        <FormControl isRequired id='token' mb={3}>
        <FormLabel>Token</FormLabel>
        
        <InputGroup>
          <Input
            placeholder='Insert Your Valid Token'
            value={token}
            onChange={(e) => setToken(e.target.value)}            
          />
        </InputGroup>
        </FormControl>

        <FormControl isRequired id='reset'>
          <FormLabel>Reset Password</FormLabel>
          <InputGroup>

          <Input
            placeholder='Enter Your New Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password" }
          />
          <InputRightElement width="4.5rem">
                    <Button height="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
          </InputGroup>

        </FormControl>

        <Button 
        colorScheme='yellow'
        width="100%"
        style={{marginTop : 15, marginBottom : 10}}
        isLoading={loading}
        onClick={submitResetHandler}
        >
        Reset Password 
        </Button>
        <InstructionModal />
        </>
      )}
    </VStack>
      </Box>
  )
}

export default ForgetPassword