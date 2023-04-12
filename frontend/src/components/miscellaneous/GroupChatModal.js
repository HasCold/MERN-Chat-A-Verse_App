import { Input, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    Box
  } from '@chakra-ui/react'
import { ChatContext } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ({children}) => {  // taking the children since we are wrapping this on the button
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectUsers, setSelectUsers] = useState([]);
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([]); // Result that we get back to an API
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const {user, chats, setChats} = useContext(ChatContext);

    const handleSearch = async(query) => {
            setSearch(query)
            if(!query){
                return;
            }
            try {
                setLoading(true);
                
                const config = {
                    headers: {
                        Authorization : `Bearer ${user.token}`,
                    }
                };
                const {data} = await axios.get(`/api/user?search=${search}`, config);
                // console.log(data);
                setLoading(false);
                setSearchResult(data);

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

    const handleSubmit = async () => {
        if(!groupChatName || !selectUsers){
            toast({
                title : 'Please Fill all the Fields',
                status : 'warning',
                duration : 5000,   // 5 sec
                position : 'top',
                isClosable : true ,
              });
              return;
        }

        try {
            const config = {
                    headers: {
                        Authorization : `Bearer ${user.token}`,
                    }
                };
            const {data} = await axios.post("/api/chat/group", {
            name : groupChatName,
            users : JSON.stringify(selectUsers.map(u => u._id)),
            }, config);

            setChats([data, ...chats])
            onClose();
            toast({
                title : 'New Group Chat Created',
                status : 'success',
                duration : 5000,   // 5 sec
                position : 'bottom', 
                isClosable : true ,
              });
        } catch (error) {
            toast({
                title : 'Failed to Create the Chat !',
                status : 'error',
                duration : 5000,   // 5 sec
                position : 'bottom', 
                isClosable : true ,
              });
        }
    }

    const handleGroup = (userToAdd) => {
        if(selectUsers.includes(userToAdd)){
            toast({
                title : 'User already added',
                status : 'warning',
                duration : 5000,   // 5 sec
                position : 'top',
                isClosable : true ,
              });
              return;
        }
        // select users that are already there  and also gonna add this user userToAdd
        setSelectUsers([...selectUsers, userToAdd]);
    }

    const  handleDelete = (delUser) => {
        setSelectUsers(selectUsers.filter(sel => sel._id !== delUser._id))
    }

    return (
        <>
        {/* Since our button will rendenred in the children props in the span tag */}
          <span onClick={onOpen}>{children}</span> 
    
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
              fontSize="35px"
              fontFamily="Work sans"
              display="flex"
              justifyContent="center"
              >Create Group Chat</ModalHeader>
              <ModalCloseButton />
              <ModalBody display="flex" flexDirection="column" alignItems="center">
              <FormControl>
                  <Input 
                  placeholder= "Group Chat Name"
                  mb={3}
                  onChange = {(e) => setGroupChatName(e.target.value)}
                   />
                </FormControl>
                <FormControl>
                  <Input 
                  placeholder= "Add Users eg : John, Hasan, Umer"
                  mb={1}
                  onChange = {(e) => handleSearch(e.target.value)}
                   />
                </FormControl>


                {/* selected users list */}
                {/* Rendered searched user */}
                <Box width="100%" display="flex" flexWrap="wrap">
                {
                    selectUsers.map((u) => ( 
                        <UserBadgeItem
                        key={u._id}
                        user={u}
                        handleFunction = {() => handleDelete(u)}
                         />
                    ))
                }
                </Box>

                {loading ? <div>loading</div> : (
                    searchResult?.slice(0,4).map((user) => (  //The syntax of the slice() method is array.slice(startIndex, endIndex). The startIndex parameter specifies the index at which to begin extraction (inclusive), and the endIndex parameter specifies the index at which to end extraction (not inclusive).
                     <UserListItem key={user._id} user={user}
                        handleFunction={() => handleGroup(user)}
                     />   
                    )))
                }
              </ModalBody>
    
              <ModalFooter>
                <Button colorScheme='blue' mr={3}  onClick={handleSubmit}>
                  Create Chat
                </Button>
                <Button colorScheme='blue'  onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
    )
}

export default GroupChatModal