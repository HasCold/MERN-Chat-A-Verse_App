const express = require("express");
const { accessChat, fetchChats, createGroupChat, renameGroupChat, addToGroup, removeFromGroup } = require("../controllers/chatControllers");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, accessChat);  // protect -->> If the user is not logged in they cannot access the chats
router.get("/", protect, fetchChats);  // Create an API for fetching all of the chats for that particular user
router.post("/group", protect, createGroupChat);
router.put("/rename", protect, renameGroupChat);
router.put("/groupremove", protect, removeFromGroup);
router.put("/groupadd", protect, addToGroup);

module.exports= router