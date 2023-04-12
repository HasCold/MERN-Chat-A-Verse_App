const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
    const {userId} = req.body;
    
    if(!userId){
        console.log("User ID param not sent with request");
        return res.sendStatus(400);
    }
        var isChat = await Chat.find({
            isGroupChat  : false,  
            $and : [  // should satify Both of the request 
                {users : {$elemMatch : {$eq : req.user._id}}}, // In MongoDB, the $elemMatch operator is used to query array fields. It allows you to specify one or more conditions that must be satisfied by the elements of an array in order to match a document.
                {users : {$elemMatch : {$eq : userId}}}
            ],  
        }).populate("users", "-password").populate("latestMessage"); 

        isChat = await User.populate(isChat, {
            path : "latestMessage.sender",
            select : "name pic email",
        });

        if (isChat.length > 0) {  // If the chat is exist then send the chat
            res.send(isChat[0]);
        }else{
            var chatData = {
                chatName : "sender",
                isGroupChat : false,
                // users : [current Loggedin User, userId which we are trying to create chat]
                users : [req.user._id, userId],
            };
            try {
                const createChat = await Chat.create(chatData);
                const FullChat = await Chat.findOne({_id : createChat._id}).populate("users", "-pasword");

                res.status(200).send(FullChat);
            } catch (error) {
                throw new Error(error.message);              
            }
        }
});

const fetchChats = asyncHandler(async (req, res) => {
    // In MongoDB, the $elemMatch operator is used to query array fields. It allows you to specify one or more conditions that must be satisfied by the elements of an array in order to match a document.
    try {
        Chat.find({users: {$elemMatch : {$eq : req.user._id}}}) // This is how we are going to find our chat
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({updatedAt : -1})  // This line uses the sort() method to sort the chats in descending order based on their updatedAt field.
        .then(async (results) => {
            results = await User.populate(results, {
                path : "latestMessage.sender", // This line uses the populate() method to load the latestMessage.sender field of each chat with a user document that represents the message sender. The select property is used to select only the name, pic, and email fields of the user document.
                select : "name pic email",
            });
            res.status(200).send(results)
        })
    } catch (error) {
        res.status(400);
        throw new Error(error.message);  
    }
});

const createGroupChat = asyncHandler(async (req, res) => {
    if(!req.body.users || !req.body.name){
        return res.status(400).send({message : "Please fill all the fields"});
    }
    var users = JSON.parse(req.body.users); // So, assuming that req.body.users is a JSON string, this line of code will convert that string into a JavaScript object and store it in the users variable.
    // After this line of code, you can use the users variable as a regular JavaScript object to access its properties and values.

    if(users.length < 2){
        return res.status(400).send("More than 2 users are required to form a group chat");
    }
    users.push(req.user);  // Current user that is logged in
    try {
        const groupChat = await Chat.create({
            chatName : req.body.name,
            users : users,
            isGroupChat : true,
            groupAdmin : req.user,  // Group Admin are us beacuse we are creating the group
        })

        const fullGroupChat = await Chat.findOne({_id : groupChat._id})
        .populate("users", "-password")  // 
        .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }

});

const renameGroupChat = asyncHandler(async (req, res) => {
    const {chatId, chatName} = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName : chatName,
        },{
            new : true,  // its gonna return us the updated value of it
        }
    ).populate("users", "-password").populate("groupAdmin", "-password");  // In summary, populate is used to retrieve and include associated data from other collections in the returned object, and it can improve performance and reduce the number of queries needed to retrieve related data.

    if(!updatedChat){
        res.status(404)
        throw new Error("Chat Not Found");
    }else{
        res.json(updatedChat)
    }
});

const addToGroup = asyncHandler(async (req, res) => {
    const {chatId, userId} = req.body;

    const added = await Chat.findByIdAndUpdate(chatId,
        {$push : {users : userId}},
        {new : true},
        ).populate("users", "-password").populate("groupAdmin", "-password");  // In summary, populate is used to retrieve and include associated data from other collections in the returned object, and it can improve performance and reduce the number of queries needed to retrieve related data.

        if(!added){
            res.status(400);
            throw new Error("Chat Not Found");
        }else{
            res.json(added);  // In this code, the added variable is the object that was added to the database. By calling res.json(added), we are sending a JSON response to the client with the added object.
            // The json() method automatically sets the Content-Type header of the response to application/json, so the client can easily parse the response as JSON.
        }
});

const removeFromGroup = asyncHandler(async (req, res) => {
    const {chatId, userId} = req.body;

    const removed = await Chat.findByIdAndUpdate(chatId,
        {$pull : {users : userId}},  // Pull the particular user Id to delete it
        {new : true},
        ).populate("users", "-password").populate("groupAdmin", "-password");  // In summary, populate is used to retrieve and include associated data from other collections in the returned object, and it can improve performance and reduce the number of queries needed to retrieve related data.

        if(!removed){
            res.status(400);
            throw new Error("Chat Not Found");
        }else{
            res.json(removed); 
        }        

    });

module.exports = {accessChat, fetchChats, createGroupChat, renameGroupChat, addToGroup, removeFromGroup};