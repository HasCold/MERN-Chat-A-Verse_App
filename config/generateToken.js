const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");

dotenv.config();

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn : "30d",  // expires a token in 30 days
    });  // create a token by sign method
} 

module.exports = generateToken;