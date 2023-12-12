
# MERN Chat-A-Verse App

MERN Chat-A-Verse App is a full-stack web application for real-time chat and verse sharing, built using the MERN (MongoDB, Express, React, Node.js) stack. The app allows users to register, log in, create chat rooms, join chat rooms, send and receive messages in real-time, and share emoji's with other users.



## Features

1. User registration and login: Users can register for a new account or log in with their existing account credentials.

2. Chat room creation and joining: Users can create chat rooms with custom names or join existing chat rooms.

3. Real-time messaging: Users can send and receive messages in real-time within chat rooms.

4. Emoji sharing: Users can share emoji's from the Emoji Input with other users in chat rooms.

5. User profiles: Users can view their own profile information, including their avatar, display name, and chat room history.

6. Responsive design: The app is designed to be responsive and can be accessed on desktop and mobile devices.

## Getting Started

## Prerequisites

Node.js and npm (Node Package Manager) installed on your local machine.

MongoDB installed and running locally or a MongoDB cloud account.

  ## Installation
  
Clone the repository to your local machine using git clone https://github.com/HasCold/MERN-Chat-A-Verse-App.git.

Navigate to the project directory and install dependencies by running npm install in both the backend directory and the client directory.

Create a .env file in the root directory and set the following environment variables:

makefile

MONGODB_URI=<your_mongodb_connection_string>

SECRET_KEY=<your_secret_key_for_jwt>

FRONTEND_URL=<your_local_port_to_access_the _token>

## Simple Mail Transfer Protocol (SMTP)
SMTP_HOST= <info_from_mailtrap.io>

SMTP_PORT= <info_from_mailtrap.io>

SMTP_USER= <info_from_mailtrap.io>

SMTP_PASS= <info_from_mailtrap.io>

## Tech Stack

**Client:** React JS, Chakra UI, CSS

**Browser Extension:**  Eye Dropper, React Developer Tools

**IDE:** VS Code

**Server:** Node.js, Express.js, MongoDB

**Socket.IO:** A library for real-time communication between the client and server.


## Dependencies

**BACKEND Dependencies :-**

npm init -->> When we type npm init , we are initializing the new node.js app 

npm i express -->> Node.js web application framework ; Really easy to build backend apps

npm i nodemon -g -->> nodemon is a tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected.

npm i dotenv -->> Secure handling of sensitive data: The .env file can contain sensitive information like passwords, access tokens, and API keys. By keeping this data separate from the codebase and using dotenv to load it into environment variables, we can ensure that the sensitive data is not accidentally shared or exposed.

npm i mongoose -->> To connect our database with server and make queries to our database

MongoDB Atlas -->> We are using the mongodb atlas in our database

npm i colors

npm i express-async-handler -->> To control all the error automatically

npm i bcryptjs --->> 

npm i jsonwebtoken --->> jwt helps us to authorize the user ; what jwt will do : user will send our jwt to the backend  and backend will verify that okay this user is authorized to access this particular resource ; This will help us alot in authorization

npm install socket.io -->> For server installation

npm install nodemailer -->> Nodemailer is a module for Node.js applications to allow easy as cake email sending. 

npm i cors -->> CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

**FRONTEND Dependencies :-**

npx create-react-app frontend -->> is a command used to create a new React project using the create-react-app tool

Chakra UI -->> It is a component library helps us our apps really fast they have the pre-built component inside of them which makes our app look a lot beautiful ; npm i @chakra-ui/react @emotion/react @emotion/styled framer-motion

npm install react-router-dom -->> for Routing

"proxy": "http://127.0.0.1:5000" -->>  For example, if you have a React app running on http://localhost:3000 and a Node.js backend running on http://localhost:5000, you can set the proxy field to http://localhost:5000, and any API requests made from the React app to paths that start with /api will be automatically redirected to http://localhost:5000/api.

npm i react-scrollable-feed -->> react-scrollable-feed aims to alleviate the burden of managing scrolling concerns from React developers. 


npm install socket.io-client -->> For Client Installation

npm i @lottiefiles/react-lottie-player@3.4.5 -->> For animations

npm i react-notification-badge

npm i timeago.js@4.0.0-beta.3 

npm i react-input-emoji -->> for emojis 

npm i emoji-picker-react

## Support
If you found any issue then report me.

For support, email ha03330224926@gmail.com.


## 🔗 Link
[Github (https://github.com/HasCold)]


## Hosting Site

Here You can view the complete build application on render.com

Here is the link :- https://chat-a-verse.onrender.com


## Contribute

Contributions are welcome. Feel free to open an issue or make a pull request.

