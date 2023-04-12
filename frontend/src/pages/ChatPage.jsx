import { Box } from '@chakra-ui/react';
import React, { useState }  from 'react'
import ChatBox from '../components/miscellaneous/ChatBox';
import MyChats from '../components/miscellaneous/MyChats';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import { ChatState } from '../Context/ChatProvider'

const ChatPage = () => {
    // eslint-disable-next-line 
    const [fetchAgain, setFetchAgain] = useState(false);
    
    /* There are two ways to define the function body:
    
    1.      Using curly braces {} to create a block of statements.
    2.      Using parentheses () to create an expression.
    
    In the ChatState component, we are using the second approach, where the function body is defined as an expression using parentheses ().
    
    When we define the function body using parentheses, we are implicitly returning the result of the expression. This means that we don't need to use the return keyword, and we don't need to use curly braces to create a block of statements.
    
    Here's an example of using an arrow function with parentheses to define an expression:
    const myFunction = (a, b) => (a + b);
    In this example, the function body is defined as an expression (a + b), and the result of the expression is returned automatically.
*/
    return (
<ChatState>  
{/* The ChatState component calls the children function with user as an argument and returns the JSX that the function generates. */}
{(user) => (
    <div style={{ width : "100%", color : "black"}}>
    {user && <SideDrawer/>}
    <Box
    display="flex"
    justifyContent="space-between"
    width="100%"
    height="92vh"
    p="10px" 
    >
        {user && <MyChats  key={user._id} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
    </Box>
    </div>
)}
 </ChatState>
    )
}

export default ChatPage