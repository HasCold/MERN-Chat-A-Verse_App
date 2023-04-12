import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import  { getSender }  from '../../config/ChatLogics';
import { ChatContext } from '../../Context/ChatProvider'
import ChatLoading from './ChatLoading';
import GroupChatModal from './GroupChatModal';

// when we come to this page we are supposed to fetch all of the chats of user 

const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const [loading, setLoading] = useState(false);
  const {user, setSelectedChat, selectedChat, chats, setChats} = useContext(ChatContext);

  const toast = useToast();

  const fetchChats = async () => {
      try {
        const config = {
          headers : {
          Authorization : `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      
      const {data} = JSON.parse(await axios.get("/api/chat", config));
      setChats(data);
      setLoading(false);
    
    } catch (error) {
      if(fetchAgain)
      toast({
        title : 'Error Occured !',
        description : "Failed to Load the Chats",
        status : "error",
        duration : 5000,   // 5 sec
        position : 'bottom-left',
        isClosable : true,
      });
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo"))); // This method is used to parse a JSON string into a JavaScript object.
    
    fetchChats();
    
    // eslint-disable-next-line
  }, [fetchAgain]);
  

  // const getSender = (loggedUser, chat) => {
  //   // const users = chat.users;
  //   return chat.users[0]._id === loggedUser._id ? chat.users[1].name : chat.users[0].name;
  // }

  return (
    <Box
    display={{base : selectedChat ? "none" : "flex", md : "flex"}}
    flexDirection = "column"
    alignItems="center"
    p={3}
    bg="white"
    w={{base : "100%" , md : "31%"}}
    borderRadius = "lg"
    borderWidth="2px"
    >
    <Box
    pb={3}
    px={3}
    fontSize={{base : "28px" , md : "30px"}}
    fontFamily = "Work sans"
    display="flex"
    w="100%"
    justifyContent="space-between"
    alignItems="center"
    >
    My Chats
    <GroupChatModal>
    <Button
    display="flex"
    fontSize={{base : "17px", md: "10px", lg : "17px"}}
    rightIcon={<AddIcon/>}
    >
      New Group Chat
    </Button>
    </GroupChatModal>
    </Box>

    <Box
    display="flex"
    flexDirection="column"
    p={3}
    bg="#F8F8F8"
    w="100%"
    h="100%"
    borderRadius="lg"
    overflowY="hidden"
    >
      {
        chats ? (
          <Stack overflowY="scroll">
             {/* Object.values(chatObject)?.map((chat) => { */}
          {
             chats?.map((chat) => {
           return  (
            <Box
            onClick={async () => setSelectedChat(chat)}
            cursor = "pointer"
            bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
            color={selectedChat === chat ? "white" : "black"}
            px={3}
            py={2}
            borderRadius="lg"
            key={chat._id}
            >
            <Text>
            { !chat.isGroupChat  ? getSender(loggedUser, chat.users) : chat.chatName}
            {/* {chatObject[chat._id]} */}
            </Text>
            </Box>
        ) 
        })}
          </Stack>
        ) : (
        <ChatLoading/>
        )
      }
    </Box>
    </Box>
  )
}

export default MyChats