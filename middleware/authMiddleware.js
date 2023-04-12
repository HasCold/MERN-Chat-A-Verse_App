const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token = req.headers.authorization.split(" ")[1]; // In other words, split(" ")[1] returns the second word of a string that has words separated by spaces. If the string only has one word, split(" ")[1] will return undefined since there is no element at index 1.
            // Bearer will look something like this -->> hdhjshbdbsidasidb
        
            // decode token id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // we are gonna find the user in our database wihtout the password
            req.user = await User.findById(decoded.id).select("-password");
            next();
        
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }
    if(!token){
        res.status(401);
        throw new Error("Not authorized, no token");
    }
})

module.exports= protect;