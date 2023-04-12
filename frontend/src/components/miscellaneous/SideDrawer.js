import { Avatar, Box, Button, Menu, MenuButton, MenuList, Text, Tooltip, MenuItem, MenuDivider, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, useToast, Spinner} from '@chakra-ui/react';
import {BellIcon, ChevronDownIcon} from '@chakra-ui/icons'
import React, { useContext } from 'react'
import { useState } from 'react'
import { ChatContext, ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
import NotificationBadge from './NotificationBadge';

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchresult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const Navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {user, setSelectedChat, chats, setChats, notification, setNotification} = useContext(ChatContext);
  const toast = useToast();

  const LogoutHandler = () => {
  localStorage.removeItem("userInfo");
  Navigate('/')
  }

  const handleSearch = async () => {
    if(!search){
      toast({
        title : 'Please Enter Something in Search',
        status : 'warning',
        duration : 5000,   // 5 sec
        position : 'top-left',
      });
      return;
    }

    try {
      setLoading(true);

      // We are supposed to send the JWT Token ; we made the route protected 
      const config = {
        headers : {
          Authorization : `Bearer ${user.token}`,
        },
      }

      const {data} = await axios.get(`/api/user?search=${search}`, config)  // search query
      // console.log(data)
      setLoading(false);
      setSearchresult(data);
    } catch (error) {
      toast({
        title : 'Error Occured !',
        description : 'Failed to Load the Search Result',
        status : 'error',
        duration : 5000,   // 5 sec
        position : 'bottom-left',
        isClosable : true ,
      });
    }
  } 
  
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers : {
          "Content-type" : "application/json",
          Authorization : `Bearer ${user.token}`,
        },        
      }

      const {data} = await axios.post("/api/chat", {userId}, config); // It will return a chat that is created 
      
      // If the chat is already inside  the chat state which we are fetching inside of my chats so we want to append it over here , it just going to update the list by doing setChats and appending the chats inside of it ; So, to summarize, if chats array does not contain an object with _id property equal to the _id property of the data object, the expression will be true, and the code inside the following block will be executed.

      // The code is using the Array.find() method to search through the chats array for an object that matches this condition.
      if(!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title : 'Error fetching the chat',
        description : error.message,
        status : "error",
        duration : 5000,   // 5 sec
        position : 'bottom-left',
        isClosable : true,
      });
    }
  }
 
  return (
    /* The ChatState component calls the children function with user as an argument and returns the JSX that the function generates. */
    <ChatState>
    {
    (user) => (
      <>
      <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      w="100%"
      p="5px 10px 5px 10px"
      borderRadius="5px"
      >
    <Tooltip 
    label="Search Users To Chat"
    hasArrow
    placement='bottom-end'
    >
      <Button variant="ghost" onClick={onOpen}>
      <i class="fa fa-search" aria-hidden="true"></i>
      <Text display={{base : "none", md: "flex"}} px={4}> 
      {/* base: the default breakpoint for small screens, such as smartphones and small tablets.
        sm: the breakpoint for screens that are larger than base, but still relatively small, such as larger smartphones and small tablets.
        md: the breakpoint for medium-sized screens, such as larger tablets and smaller laptops.
        lg: the breakpoint for larger screens, such as desktops and larger laptops.
        xl: the breakpoint for extra-large screens, such as large desktop monitors.
       */}
        Search User
      </Text>
      </Button>
    </Tooltip>

    <Text fontSize="2xl" fontFamily="Work sans" fontWeight="bold">
      Chat-A-Verse
    </Text>

    <div>
      <Menu>
        <MenuButton p={1} paddingRight={3}>
        <NotificationBadge notification={notification}/>
        <BellIcon fontSize="2xl" m={1}/>
        </MenuButton>
        {/* Notification */}
        <MenuList pl={2} cursor="pointer">
          {!notification.length && "No New Messages"}
          {notification.map(notif => (
            <MenuList key={notif._id} onClick={() => {
              setSelectedChat(notif.chat);
              // Remove that particular notification from the arrays of notification list
              setNotification(notification.filter((n) => n !== notif));
            }}>
              {notif.chat.isGroupChat 
              ? `New Message in ${notif.chat.chatName}`
              : `New Message From ${getSender(user, notif.chat.users)}`
              }
            </MenuList>
          ))}
        </MenuList>
      </Menu>

      <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
      <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}/>
      </MenuButton>
      <MenuList>
      <ProfileModal user={user}>
        <MenuItem>Profile</MenuItem>
      </ProfileModal>
        <MenuDivider/>
        <MenuItem onClick={LogoutHandler}>Logout</MenuItem>
      </MenuList>
      </Menu>
    </div>
      </Box>
      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
       <DrawerOverlay />
       <DrawerContent>
        <DrawerHeader borderBottomWidth="2px" >Search User</DrawerHeader>
       <DrawerBody>
        <Box display="flex" pb={2}>
        <Input 
          placeholder='Search by name or email'
          mr={2}
          value={search}  // Controlled Input
          onChange={(e) => setSearch(e.target.value)}
         />
         <Button 
         onClick={handleSearch}>Go</Button>
        </Box>
        {
          loading ? <ChatLoading/> :
           (
            searchResult?.map((user) => (
              <UserListItem
              key={user._id}
              user={user}
              handleFunction = {() => accessChat(user._id)}
               />
            ))
          )}
        {loadingChat && <Spinner ml="auto" display="flex" />}
       </DrawerBody>
       </DrawerContent>
      </Drawer>
      </>
    )
    }
    </ChatState>
  )}

export default SideDrawer