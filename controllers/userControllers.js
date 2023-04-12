const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const User = require("../models/userModel");
const sendEmail = require('../utils/sendEmail');
const crypto = require("crypto");

const registerUser = asyncHandler ( async (req, res) => {
        const {name, email, password, pic} = req.body;

        if(!name || !email || !password){
            res.status(400);
            throw new Error("Please Enter All the Fields");
        }

        // it checks if the user with the same email already exists in the database. If the user exists, it returns a response with a 400 error code and an error message.
        const userExist = await User.findOne({email });
        if(userExist) {
            res.status(400);
            throw new Error("User Already Exist");
        }

        const user = await User.create({
            name,
            email,
            password,
            pic,
        });
        if(user){
            res.status(201).json({
                _id : user._id,
                name : user.name,
                email : user.email,
                pic : user.pic,
                token : generateToken(user._id),
            })
        }else{
            res.status(400);
            throw new Error("User not found");
        }

})

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    }  else {
        res.status(401);
        throw new Error("Invalid Email or Password");
      }      
  });

//  /api/user?search=hasan
const allUser = asyncHandler(async (req, res) => {
    const keyword =  req.query.search ? {
        // console.log(keyword);
    // There is a OR operator in mongodb ;; You need to fulfill either one of the request 
    $or : [
        // $regex -->> Provides a regular expression capabilities for pattern string in queries ; You can learn alot in mongodb official documentation 
        {name : {$regex: req.query.search, $options: "i"}},
        {email : {$regex: req.query.search, $options: "i"}},
    ] 
} : {};
const users = await User.find(keyword).find({_id : {$ne : req.user._id}});
res.send(users);  
});

// Update the Password (Forget Password API) 
const forgetPassword = asyncHandler( async (req, res) => {
    const {email} = req.body;

    const user = await User.findOne({email});
    

    if(!user){
         res.status(400); 
         throw new Error("User Not Found");
        }
         
        const resetToken = await user.getResetToken();
        user.save();

        // Send Token via Email
        const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
        
        // http://localhost:3000/resetpassword/ajkbsdbkabdkabdbjoqak
        const message = `Click on the link to reset your password. ${url}. If you have not requested then please ignore`;

        await sendEmail(user.email, "CourseBundler Reset Password", message)

    res.status(200).json({
        success : true,
        message : `Reset Token has been sent to ${user.email}`
    });
});

const resetpassword = asyncHandler(async (req, res) => {
    
    const {token} = req.body;

    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire : {
            $gt : Date.now(), // greater than in mongoDB ; The time must be bigger than the time is going on
        },
    });
    if(!user){
    throw new Error("Token is Invalid or has been expired"); 
    }    

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    if(token){
        res.status(200).json({
            success : true,
            message : "Password Reset Successfully",
        })
    }else{
        res.status(401);
        throw new Error("Token Not Found");
    }
}) 


module.exports = {registerUser, authUser, allUser, forgetPassword, resetpassword};