import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({children}) => {
  const [user, setUser] = useState();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [notification, setNotification] = useState([]);
  const [email, setEmail] = useState("");

    const Navigate = useNavigate();

    useEffect(() => {
      const userinfo = JSON.parse(localStorage.getItem("userInfo"));  // fetch the local storage
        setUser(userinfo);
      if(!userinfo) Navigate("/");
        // eslint-disable-next-line
    }, [Navigate]);
    

    return(
        <>
        <ChatContext.Provider value={{user, setSelectedChat, selectedChat, chats, setChats, notification, setNotification, email, setEmail}}>
        {children}
        </ChatContext.Provider>
        </>
    )
}

export const ChatState = ({children}) => {
    const {user} = useContext(ChatContext);  // The ChatState function is a component that provides access to the user value in the ChatContext. It takes a children prop, which should be a function that returns some JSX.
    // Inside the ChatState component, we are using the useContext hook to get the user value from the ChatContext. Then, we are passing that user value to the children function as an argument. This allows us to use the user value inside the JSX returned by the children function. 

    return children(user);
}

export default ChatProvider;
export {ChatContext}