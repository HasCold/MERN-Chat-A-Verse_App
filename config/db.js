// This db will responsible to connect our database

const mongoose = require("mongoose");
const colors = require("colors");
mongoose.set('strictQuery', false);
const dotenv =  require("dotenv");

dotenv.config();
const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser : true,
            useUnifiedTopology : true,
            useFindAndModify : true,
            serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
        });
        console.log(`MongoDB Atlas Successfully Connected : ${conn.connection.host}`.cyan.underline );
    }catch(error){
        console.log(`Error : ${error.message}`.red.bold);
        process.exit();
    }
};

module.exports= connectDB;