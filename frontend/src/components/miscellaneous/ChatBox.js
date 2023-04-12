import { Box } from '@chakra-ui/react';
import React, { useContext } from 'react'
import { ChatContext } from '../../Context/ChatProvider';
import SingleChats from '../SingleChats';


const ChatBox = ({fetchAgain, setFetchAgain}) => {
  const {selectedChat} = useContext(ChatContext);
  return (
    <Box display={{base: selectedChat ? "flex" : "none", md: "flex"}}
    alignItems="center"
    flexDirection="column"
    p={3}
    bg="white"
    width={{base : "100%" , md: "68%"}}
    borderRadius="lg"
    borderWidth="1px"
    >
      <SingleChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox