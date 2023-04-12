import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Signup = () => {

    const [show, setShow] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState(); 
    const [password, setPassword] = useState();
    const [confirmPassword, setconfirmPassword] = useState();
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const Navigate = useNavigate();

    const handleClick = () => setShow(!show);
    const postDetails = (pics) => {
        setLoading(true);
        if(pics === undefined){
            toast({
                title : "Please Select an Image",
                status : "warning",
                duration : 5000,  // 5 sec
                isClosable : true,
                position : 'bottom',
            });
            return;
        }
        if(pics.type === "image/jpeg" || pics.type === "image/png" || pics.type === "image/jpg"){
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "Chat-App");
            data.append("cloud_name", "dpkexrbuo");
            fetch("https://api.cloudinary.com/v1_1/dpkexrbuo/image/upload", {
                method : "post",
                body : data,
            }).then((res) => res.json())
            .then((data) => {
                setPic(data.url.toString());  // In the case of data.url.toString(), we are calling the toString() method on the url property of the data object. This is likely being done to ensure that the url property is converted to a string, even if it was originally some other type of value.
                toast({
                    title : "Image Uploaded Successfully",
                    status : "success",
                    duration : 5000,  // 5 sec
                    isClosable : true,
                    position : 'bottom', 
                })
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            }); 
        }else {
            toast({
                title : "Please Select an Image",
                status : "warning",
                duration : 5000,  // 5 sec
                isClosable : true,
                position : 'bottom', 
            })
        }
    }

    const submitHandler = async () => {
        setLoading(true);
        if(!name || !email || !password || !confirmPassword){
            toast({
                title : "Please Fill All the Fields",
                status : "warning",
                duration : 5000,  // 5 sec
                isClosable : true,
                position : 'bottom', 
            })
            setLoading(false);
            return;
        }   
        if(password !== confirmPassword){
            toast({
                title : "Passwords Do Not Match",
                status : "warning",
                duration : 5000,  // 5 sec
                isClosable : true,
                position : 'bottom', 
            });
            return;
        }
        try {
            const config = {
                headers : {
                    "Content-type" : "application/json",
                },
            };
            const {data} = await axios.post("/api/user", {name, email, password, pic}, config);  // API end-point 
            toast({
                title : "Registration Successful",
                status : "success",
                duration : 5000,  // 5 sec
                isClosable : true,
                position : 'bottom', 
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
             Navigate("/chats");
        } catch (error) {
            toast({
                title : "Error Occured !",
                description : error.response.data.message,
                status : "error",
                duration : 5000,
                isClosable : true,
                position : "botton"
            });
            setLoading(false);
            }
    }

  return (
    <VStack spacing="5px" >
    <FormControl id='first-name' isRequired>
            <FormLabel>Name</FormLabel>
                <Input 
                placeholder='Enter Your Name'
                onChange={(e) => setName(e.target.value)}
                />
    </FormControl>
    <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
                <Input 
                placeholder='Enter Your Email'
                onChange={(e) => setEmail(e.target.value)}
                />
    </FormControl>
    <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input 
                type={show ? "text" : "password" }
                placeholder='Enter Your Password'
                onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <Button height="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
    </FormControl>

    <FormControl id='Confirmpassword' isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
                <Input 
                type={show ? "text" : "password" }
                placeholder='Enter Your Password Again'
                onChange={(e) => setconfirmPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <Button height="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
    </FormControl>

    <FormControl id='pic' >
            <FormLabel>Upload your Picture</FormLabel>
                <Input 
                type="file"
                p={1.5}
                accept="image/*"
                onChange={(e) => postDetails(e.target.files[0])}
                />
    </FormControl>
    <Button
    colorScheme="blue"
    width="100%"
    style={{marginTop: 15}}
    onClick={submitHandler}
    isLoading={loading}
    >
    Sign Up
    </Button>

    </VStack>
  )
}

export default Signup