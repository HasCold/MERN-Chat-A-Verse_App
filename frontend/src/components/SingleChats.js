import React, {useContext, useEffect, useState } from 'react'
import { ChatContext } from '../Context/ChatProvider'
import {Box, FormControl, IconButton, Input, Spinner, Text, useToast, Button} from '@chakra-ui/react'
import {ArrowBackIcon} from '@chakra-ui/icons'
import {getSender, getSenderFull} from '../config/ChatLogics.js'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdatedGroupChatModal from './miscellaneous/UpdatedGroupChatModal'
import axios from 'axios'
import "./style.css"
import ScrollableChat from './ScrollableChat'
import io from "socket.io-client";
import { Player } from '@lottiefiles/react-lottie-player';
import { IoMdSend } from "react-icons/io";
import InputEmoji from "react-input-emoji";


const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChats = ({fetchAgain, setFetchAgain}) => {
  
  const {user, selectedChat, setSelectedChat, notification, setNotification} = useContext(ChatContext);
  const [message, setMessage] = useState([]); // contain all our fetched messages from backend
  const [loading, setLoading] = useState(false); // contain all our fetched messages from backend
  const [newMessage, setNewMessage] = useState(); // contain all our fetched messages from backend
  const toast = useToast();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setisTyping] = useState(false);

    const fetchMessages = async () => {

      // console.log("New Message :- ",newMessage);
    if(!selectedChat) return;

    try {
      const config = {
          headers : {
            Authorization : `Bearer ${user.token}`,
          },
        }
        setLoading(true);

        const {data} = await axios.get(`/api/message/${selectedChat._id}`, config)
        // console.log(message)
        setMessage(data);
        setLoading(false);
        socket.emit("join chat", selectedChat._id); // new room so that user can join this room with selected chat 
      } catch (error) {
        toast({
                title : 'Error Occured !',
                description : "Failed to Load the Messages",
                status : 'error',
                duration : 5000,   // 5 sec
                position : 'bottom', 
                isClosable : true ,
              });
              return;
            }
          }

const sendMessage = async () => {
            if(newMessage ){
              socket.emit("stop typing", selectedChat._id);
              try {
                const config = {
                  headers : {
                    "Content-Type" : "application/json",
                    Authorization : `Bearer ${user.token}`,
                  },
                };
                
                setNewMessage("");
                  const {data} = await axios.post("/api/message", {
                    content : newMessage,
                    chatId : selectedChat._id,
                  }, config);
          
                  socket.emit("new message", data);
                  setMessage([...message, data]); // append the messages
              } catch (error) {
                toast({
                        title : 'Error Occured !',
                        description : "Failed to send the Message",
                        status : 'error',
                        duration : 5000,   // 5 sec
                        position : 'bottom', 
                        isClosable : true ,
                      });
                      return;
              }
            }
}
          
// Initialize the socket and set up event listeners
 useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setisTyping(true));
    socket.on("stop typing", () => setisTyping(false));

    // eslint-disable-next-line 
  },[])
  
  // whenever the user switches the chat so selectedChat changes, this gonna fetch the messages again and again
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;

  // eslint-disable-next-line
  }, [selectedChat]); 
  
  // Set up event listener for incoming messages
  useEffect(() => {
    // Its gonna monitor the socket to see if we recieve anything from this we are gonna accordingly put it insisde of our chat  
    
    socket.on("message received", (newMessageReceived) => {
    
      if(!selectedChatCompare // // if chat is not selected or doesn't match current chat
        || selectedChatCompare._id !== newMessageReceived.chat._id){
          // Give Notification
          if(!notification.includes(newMessageReceived)){ // if the notification array doesn't include the newMessageRecieved
            setNotification([newMessageReceived, ...notification]);
            // Update the list of our chat
            setFetchAgain(!fetchAgain);
          } 

      }else{
        setMessage([...message, newMessageReceived]);
      }
    })
  })
  

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    
    // Typing Indicator Logic

    if(!socketConnected) return;

    if(!typing){
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    // Debouncing ; The purpose of this is to reduce the number of unnecessary "start typing" and "stop typing" messages being sent to the server. If we didn't use debouncing, every keystroke by the user would trigger a new "start typing" message to the server, even if the user was just quickly typing a short message. This can create unnecessary network traffic and impact performance.

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if(timeDiff >= timerLength && typing){
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }

    }, timerLength);
  }; // Not used in the UI
  
  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  //   Typing Indicator Logic
    if(!socketConnected) return;

    if(!typing){
      setTyping(true);
        socket.emit("typing", selectedChat._id );
      }
      
      let lastTypingTime = new Date().getTime();
      var timerLength = 3000;
      
      setTimeout(() => {
        var timeNow = new Date().getTime();
        var timeDiff = timeNow - lastTypingTime;
        
        if(timeDiff >= timerLength && typing){
          socket.emit("stop typing", selectedChat._id);
          setTyping(false);
        }
      }, timerLength);
  };
    
    return(
    <>
      {selectedChat ? (
        <>
          <Text
          fontSize={{base : "28px" , md : "30px"}}  // base is a smaller screen 
          pb={3}
          px={2}
          width="100%"
          display="flex"
          justifyContent={{base : "space-between"}}
          alignItems="center"          
          >
         <IconButton
         display={{base : "flex", md : "none"}}  // Its only gonna be display when the display is base
         icon={<ArrowBackIcon />}
         onClick={() => setSelectedChat("")}
          />
          {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)}/>
              </>
          ) : (
              <>
              {selectedChat.chatName.toUpperCase()}
              <UpdatedGroupChatModal
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
              fetchMessages={fetchMessages}
               />
              </>
          )
          }
          </Text>
          <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          p={3}
          bg="#E8E8E8"
          width="100%"
          height="100%"
          borderRadius="lg"
          overflowY="hidden"
          >
              {/* {Messages Here} */}
            
               {       
              loading ? (
                <Spinner
                size="xl"
                width={20}
                height={20}
                alignSelf="center"
                margin="auto"
                 />
              ) : (
                <div className='messages'>
                {/* Messages Section */}

                <ScrollableChat message={message} />
                </div>
              )}

              <FormControl onKeyDown={(event) => {
                   if(event.key === "Enter"){
                    sendMessage();
                   }}}
                    isRequired mt={3}>
                <Box display="flex">
                <InputEmoji 
                  value= {newMessage}
                  type="text"
                  onChange={handleChange}
                  variant = "filled"
                  placeholder="Enter a message..."
                  bg="#E0E0E0"
                />
                {/* <Input 
                  variant = "filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message..."
                  onChange={typingHandler}
                  value={newMessage} // controlled input text 
                /> */}
                <Button onClick={sendMessage} style={{marginTop : "5px"}}>
                  <IoMdSend type="submit" color='#36a689' /> 
                </Button>
                </Box>
              </FormControl>
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontfamily="Work sans">
          Click on a user to start chatting
          </Text>
        </Box>
      )
      }
    </>
  )
}

export default SingleChats