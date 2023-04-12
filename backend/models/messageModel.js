const mongoose = require("mongoose");

const messageModel  = mongoose.Schema({
    sender : {type : mongoose.Schema.Types.ObjectId, ref : "User" },
    content : {type : String, trim : true},
    chat : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Chat",
    },
    // createdAt : {
    //     type : Date,
    //     default : new Date(),
    // },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, {
    // timeStamps : true is an option passed to the schema definition of messageModel. This option tells Mongoose to automatically add two timestamp fields to the document: createdAt and updatedAt.

// The createdAt field will be automatically set to the date and time when a document is first created, while the updatedAt field will be automatically updated to the date and time whenever the document is modified.
// By setting timeStamps to true, the Mongoose schema will handle these timestamp fields automatically, so you don't need to manually set or update them in your code.

    timestamps : true,
})

const Message = mongoose.model("Message", messageModel);
module.exports = Message;