//import .env and configure its content
require("dotenv").config();

//import express
const express = require("express");
const cors = require ("cors");
const fileupload = require('express-fileupload')

// rename express to app
const app = express();

// Models
const User = require("./Users/model");
const Character = require("./Characters/model");
const User_Characters = require("./User_Characters/model");

// Routes
const userRouter = require("./Users/routes");
const charRouter = require("./Characters/routes");
const { updatePic } = require("./Users/controllers");
const { tokenCheck } = require("./middleware");



// specify port the server will listen on
const port = process.env.PORT || 5001; //if the server can't load on 5002 it will load on 5001.

//app.use() is for middleware
app.use(express.json({limit: "1000kb"}));
app.use(cors());
app.use(fileupload());



const syncTables = () => {
    User.sync();
    Character.sync();
    User_Characters.sync();
};

app.use(userRouter);
app.use(charRouter);

//health check for your API and see if server is working
app.get("/health", (req, res) => {
    res.status(200).json({
        message: "SUCCESS! This API is alive and healthy!"
    })
});

// listener for your server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
   //run the function to sync and create the tables
    syncTables();
});