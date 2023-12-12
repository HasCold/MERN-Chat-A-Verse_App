const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const User = require("./models/userModel");
const path = require("path")
const cors = require("cors");

dotenv.config();
const app = express(); // app means it is executed function of express;
connectDB();
app.use(express.json()); // Server To accept the json data from Frontend 

app.use(cors({
    origin:["http://localhost:3000","http://localhost:5000", "https://chat-a-verse.onrender.com"],
    credentials: true
}));

app.use((req, res, next) => {   
  res.header("Access-Control-Allow-Origin", ["http://localhost:3000","http://localhost:5000", "https://chat-a-verse.onrender.com"]);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Access-Control-Allow-Credentials', 'true');

  next();
})

// By adding User.createDefaultUser(); In this way, the default user will be created only once, when the server starts up but only if it doesn't exist.
User.createDefaultUser();

app.use("/api/user", userRoutes);   // By using app.use() method with the "/api/user" path, we are telling the Express application to use the userRoutes middleware for any requests starting with "/api/user". This makes our code modular and easier to maintain as we can define separate routers for different parts of our API.
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Static files
// app.use(express.static(path.join(__dirname, "./frontend/build")));
// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "./frontend/build/index.html"));
// });

// ---------------------- DEPLOYMENT -----------------

    const __dirname1 = path.resolve();
    if(process.env.NODE_ENV === "production"){
        app.use(express.static(path.join(__dirname1, "/frontend/build")));

        app.get("*", (req, res) => {
            res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
        })
    }else{
        app.get('/', (req, res) => {
            res.send("Server is running successfully !");
        })
    }


// ---------------------- DEPLOYMENT -----------------


// Error Handling Middleware

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server Successfully Connected On ${PORT} port !!!`.yellow.bold));

const io = require("socket.io")(server, {
    pingTimeout : 60000,  // a user didn't send any message or something so its gonna close the connection in 60 sec
    cors : {  // Cross Origin Error
        origin : ["http://localhost:3000","http://localhost:5000", "https://chat-a-verse.onrender.com"],
    }
})

// Create a connection
io.on("connection", (socket) => {
    console.log("Connected to socket.io");  // If shows in console after with the frontend config then proves successfully connected

    // This will take the user data from frontend
    socket.on("setup", (userData) => {
        socket.join(userData._id);  // exclusive room for a paritcular user
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined room : " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;  // which chat does this belong to because I m supposed to manage this message from here and send them into these rooms

        if(!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user => {
            if(user._id === newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceived);
        });

    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    })
})