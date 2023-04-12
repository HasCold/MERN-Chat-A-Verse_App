// chatName
// isGroupChat
// users
// latestMessage
// groupAdmin

const mongoose = require("mongoose");

// Schema :- Means how the data shows in our database
const chatModel = mongoose.Schema(
    {
        chatName : {type : String, trim : true},   // We are gonna trim the name so there is no trailing spaces after or before it
        isGroupChat : {type : Boolean, default : false},
        users : [{
            type : mongoose.Schema.Types.ObjectId,  // this will contain the id to that particular user
            ref: "User",
        }],
        latestMessage : {
            type : mongoose.Schema.Types.ObjectId,  // this will contain the id to that particular user
            ref : "Message",   // Model created for the message as well 
        },
        groupAdmin : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",  
        }
    },
    {
// timeStamps : true is an option passed to the schema definition of messageModel. This option tells Mongoose to automatically add two timestamp fields to the document: createdAt and updatedAt.

// The createdAt field will be automatically set to the date and time when a document is first created, while the updatedAt field will be automatically updated to the date and time whenever the document is modified.

// By setting timeStamps to true, the Mongoose schema will handle these timestamp fields automatically, so you don't need to manually set or update them in your code.

        timestamps : true,
    }
)

// The first argument to the mongoose.model() method is a string representing the name of the collection in MongoDB. Mongoose will automatically create a collection with this name when you start inserting documents using this model.

const Chat = mongoose.model("Chat", chatModel);
module.exports = Chat;