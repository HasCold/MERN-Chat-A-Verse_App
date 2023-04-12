const express = require("express");
const { registerUser, authUser, allUser, forgetPassword, resetpassword } = require("../controllers/userControllers");
const protect = require("../middleware/authMiddleware");
const router = express.Router();  // Instance to create a router of express

router.post("/" ,registerUser); // registration
router.get("/", protect, allUser);  // protect -->> If the user is not logged in they cannot access the chats
router.post("/login", authUser);
router.post("/forgetpassword", forgetPassword);
router.put("/resetpassword", resetpassword);

module.exports = router;