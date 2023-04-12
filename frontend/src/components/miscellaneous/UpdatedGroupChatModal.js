import { ViewIcon } from '@chakra-ui/icons'
import { IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useToast, Box, FormControl, Input, Button, ModalFooter, Spinner, } from '@chakra-ui/react'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import { ChatContext } from '../../Context/ChatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import UserListItem from '../UserAvatar/UserListItem'

const UpdatedGroupChatModal = ({fetchAgain, setFetchAgain, fetchMessages}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

  const {setChats, chats, selectedChat, setSelectedChat, user} = useContext(ChatContext);
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameloading] = useState(false);
  const toast = useToast();
  
  const handleRemove = async (user1) => { // user1 is a loggedIn user
    // console.log("user1 :-", user1)
    // console.log("selectedChat :-", selectedChat)

    if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id ){
      toast({
        title : 'Only Admins can remove someone! ',
        status : 'error',
        duration : 5000,   // 5 sec
        position : 'bottom',
        isClosable : true ,
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers : {
          Authorization : `Bearer ${user.token}`,
        },
      }

      const {data} = await axios.put(`/api/chat/groupremove`,{
        chatId : selectedChat._id,
        userId : user1._id,
      } , config);

      //  If the user who is loggedin remove itself or he has left the group then we are gonna make setSeletedChat is empty 

      if(selectedChat.groupAdmin._id === user._id){

        setSelectedChat();
        setChats([]);
        fetchMessages(); // so that all the messages get refreshed

        toast({ 
          title : `${selectedChat.groupAdmin.name} Group Admin leaved the Group` ,
          status : 'success',
          duration : 5000,   // 5 sec
          position : 'bottom',
          isClosable : true ,
        });
        return;
      } 

  if(user1._id === user._id) {
    setSelectedChat();
    setChats([]);
    fetchMessages(); // so that all the messages get refreshed
      toast({ 
        title : `${user1.name} leaved the Group` ,
        status : 'success',
        duration : 5000,   // 5 sec
        position : 'bottom',
        isClosable : true ,
      });
      return;
    } else{
    setSelectedChat(data);
  }
      setFetchAgain(!fetchAgain);
      setLoading(false);

    } catch (error) {
      toast({
        title : 'Error Occured !',
        description : error.response.data.message,
        status : 'error',
        duration : 5000,   // 5 sec
        position : 'bottom',
        isClosable : true ,
      });
      setLoading(false);
    }
  }

  const handleRename = async () => {
    if(!groupChatName) return;

    try {
      setRenameloading(true);

      const config = {
        headers : {
          Authorization : `Bearer ${user.token}`,
        },
      }

      const {data} = await axios.put(`/api/chat/rename`,{
        chatId : selectedChat._id,
        chatName : groupChatName,
      } , config);
      setSelectedChat(data);
      // setChats(Object.keys(data).map(key => ({ [key]: data[key] })));
      setChats([data]);
      setFetchAgain(!fetchAgain);
      setRenameloading(false);
      
    } catch (error) {
      toast({
        title : 'Error Occured !',
        description : error.response.data.message,
        status : 'error',
        duration : 5000,   // 5 sec
        position : 'bottom',
        isClosable : true ,
      });
      setRenameloading(false);
    }
    setGroupChatName("")
  };
  
  const handleSearch = async (query) => {
    setSearch(query);  
    if(!query) {
        return;
      }
      try {
        setLoading(true);
  
        const config = {
          headers : {
            Authorization : `Bearer ${user.token}`,
          },
        }
  
        const {data} = await axios.get(`/api/user?search=${search}`,config);
        // console.log("Search User :-", data);
        setLoading(false)
        setSearchResult(data);
        
      } catch (error) {
        toast({
          title : 'Error Occured !',
          description : "Failed to load the Search Results",
          status : 'error',
          duration : 5000,   // 5 sec
          position : 'bottom-left',
          isClosable : true ,
        });
        setLoading(false);
      }
      setGroupChatName("")
    };

    const handleAddUser = async (user1) => {
        if(selectedChat.users.find((u) => u._id === user1._id)){
          toast({
            title : 'User Already in Group',
            status : 'error',
            duration : 5000,   // 5 sec
            position : 'bottom',
            isClosable : true ,
          });
          return;
        }

        if(selectedChat.groupAdmin._id !== user._id){
          toast({
            title : 'Only admins can add someone!',
            status : 'error',
            duration : 5000,   // 5 sec
            position : 'bottom',
            isClosable : true ,
          });
          return;
        }

        try {
        setLoading(true);
  
        const config = {
          headers : {
            Authorization : `Bearer ${user.token}`,
          },
        }
  
        const {data} = await axios.put(`/api/chat/groupadd, {
          chatId : selectedChat._id,
          userId : user1._id,
        }`,config);
        setSelectedChat(data);
        setFetchAgain(fetchAgain);
        setLoading(false);

      } catch (error) {
        toast({
          title : 'Error Occured !',
          description : error.response.data.message,
          status : 'error',
          duration : 5000,   // 5 sec
          position : 'bottom',
          isClosable : true ,
        });
        setLoading(false);

    }
  }

    return (
    <>
          
      <IconButton  display={{base: "flex"}} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize="35px"
          fontFamily="Work sans"
          display="flex"
          justifyContent="center"
          >{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Box width="100%" display="flex" flexWrap="wrap" pb={3}>
            {selectedChat.users.map((u) => (
              <UserBadgeItem 
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
              />
            ))}
          </Box>
        <FormControl display="flex"> 
              <Input 
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange = {(e) => setGroupChatName(e.target.value)}
              />
        <Button
        variant="solid"
        colorScheme="teal"
        ml={1}
        isLoading={renameloading}
        onClick={handleRename}
        >  
        Update
        </Button>
        </FormControl>

        <FormControl > 
              <Input 
                placeholder="Add User to group"
                mb={1}
                onChange = {(e) => handleSearch(e.target.value)}
              />
        </FormControl>
              {
                loading ? (
                  <Spinner size="lg" display="flex" alignItems="center"/>
                ) : (
                  searchResult?.map((user) => (
                    <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                     />
                  ))
                )
              }

          </ModalBody>

          <ModalFooter>
          <Button colorScheme='red'  onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
            <Button colorScheme='blue' ml={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    
    </>
  )
}

export default UpdatedGroupChatModal