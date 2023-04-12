export const getSender = (loggedUser, users) => {
  // console.log("users :", users);
  // console.log("loggedUser :", loggedUser);
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
}

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
}

// If all of these conditions are true, the function returns "true", indicating that the sender of the current message is different from the sender of the next message and is also not the logged-in user.

// In the code snippet you provided, i + 1 is used to refer to the next message in the message array.

// Here, i represents the index of the current message in the message array. By adding 1 to i, the code accesses the message at the next index in the array.
// For example, if i is 2, then i + 1 is 3, so message[i + 1] refers to the message at index 3 in the message array.

export const isSameSender = (message, m, i, userId) => {
  return(
    i < message.length - 1 && 
    (message[i + 1].sender._id !== m.sender._id || 
      message[i + 1].sender._id === undefined) &&
      message[i].sender._id !== userId  
  )
};

export const isLastMessage = (message, i, userId) => {
    return(
      i === message.length - 1 && 
      message[message.length - 1].sender._id !== userId && // The id of the last messages array is not equal to the current loggedIn userId
      message[message.length - 1].sender._id  // And that messages actually exist 
    );
};

// Logic of margin between sender message and loggedIn user message

export const isSameSenderMargin = (message, m, i, userId) => { // i represents the index of the current message; message is an array of messages; m is the current message being compared ; "userId" is the ID of the user who is currently logged in.
    if(
      i < message.length - 1 &&
      message[i + 1].sender._id === m.sender._id &&
      message[i].sender._id !== userId
    )
    return 33;

    else if(
       (i < message.length - 1 &&
      message[i + 1].sender._id !== m.sender._id &&
      message[i].sender._id !== userId ) ||
      (i === message.length - 1 && message[i].sender._id !== userId)
    )
    return 0;
    else return "auto";
};

// Logic of spacing between previous message and current message 

export const isSameUser = (message, m, i) => {
  return i > 0 && message[i - 1].sender._id === m.sender._id;
};