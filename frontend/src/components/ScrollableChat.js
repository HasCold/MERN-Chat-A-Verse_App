import { Avatar, Tooltip } from '@chakra-ui/react';
import React, { useContext } from 'react';
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics';
import { ChatContext } from '../Context/ChatProvider';
import {format} from "timeago.js";

const ScrollableChat = ({message}) => {
    const {user} = useContext(ChatContext);
 
  return (
    <ScrollableFeed>
    {
        message && message.map((m,i) => ( // m = current message & i = index
            <div style={{display : "flex"}} key={m._id}>
                {
                    (isSameSender(message, m, i, user._id) || 
                    isLastMessage(message, i, user._id)
                    ) && (
                        <Tooltip
                        label={m.sender.name}
                        placement="bottom-start"
                        hasArrow
                        >
                            <Avatar
                            mt="10px"
                            mr={1}
                            size="sm"
                            cursor="pointer"
                            name={m.sender.name}
                            src={m.sender.pic}
                             />
                        </Tooltip>
                    )
                }
                <span
                style={{
                    backgroundColor : `${
                        // m.sender._id === user._id ? "#BEE3F8" : "B9F5D0"
                        m.sender._id === user._id ? "#278ff3 " : "#ff9124 "
                    }`,
                    color : "white",
                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                    marginLeft: isSameSenderMargin(message, m, i, user._id),
                    marginTop: isSameUser(message, m, i, user._id) ? 5 : 10,
                }}
                >
                {m.content}
                <span style={{display : "flex", flexDirection: "column", fontSize: "11px"}}>
                {format(m.createdAt)}
                </span>
                </span> 
            </div>
        ))
    }
    </ScrollableFeed>
  )
}

export default ScrollableChat