const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// We are gonna encrypt the password 
// Middleware functions allow you to modify data before or after it's saved to the database, enforce business rules, and trigger additional processing. This can be useful for things like hashing passwords, validating input, or logging activity.

const userSchema = mongoose.Schema({
    name : {type : String, required : true},
    email : {type : String, required : true, unique : true},
    password : {type : String, required : true},
    pic : {type : String, default : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",},
    resetPasswordToken : {type : String},
    resetPasswordExpire : {type : String},
}, {
    timestamps : true,
});

// In summary, this middleware function is ensuring that every time a new user is saved to the database, their password is hashed and stored securely.
userSchema.pre("save", async function (next){   // By using the pre("save") middleware, we can modify the data in a document just before it gets saved to the database. This allows us to perform additional processing on the data to make sure it's in the format we want it to be in.
    if(!this.isModified){
        next(); // jab bhi hame agle routes pr jana ha tu next() ko call krna parega nahi tu loading show hoti rahe gi
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
}) // pre Means Before saving what we should do

userSchema.methods.matchPassword = async function (enterredPasword) {
       return await bcrypt.compare(enterredPasword, this.password); 
};

userSchema.methods.getResetToken = async function(){
    // This code generates a random string of 20 bytes using the crypto.randomBytes() method provided by Node.js' built-in crypto module. The toString("hex") method is then called on the result to convert the random bytes to a hexadecimal string.

 const resetToken = crypto.randomBytes(20).toString("hex");

 this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
//  Date.now(), and then adding 15 minutes to it (multiplying 15 by 60 to get the number of seconds, and then multiplying that by 1000 to get the number of milliseconds).
 this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

 return resetToken;
}
 
// console.log(crypto.randomBytes(20).toString("hex"));

// Create a default user  ;;   the default user will be created only if it doesn't already exist.
userSchema.statics.createDefaultUser = async function(){
    const User = mongoose.model("User",userSchema);

    const userExist = await User.findOne({email : "guest@example.com"});
    if(userExist){
        console.log("Default user already exists");
        return;
    }
    const user = new User({
        name: "Guest User",
    email: "guest@example.com",
    password: "123456",
    pic: "/avatar.png",
    })
    try {        
        await user.save(); // n Mongoose, the save() method is used to persist a document instance to the database. When you create or update a document, you need to call the save() method on the document instance to save the changes to the database.
        console.log("Default user created successfully");
    } catch (error) {
        console.log("Error in creating default user : ", error.message);
    }
}

const User = mongoose.model("User", userSchema);
module.exports = User;