//import sequelize library from the sequelize dependencies downloaded
const { Sequelize } = require("sequelize");

require("dotenv").config();

//establish connection to database where uri is stored in .env
const SQLconnection = new Sequelize(process.env.SQL_URI);

//test to see if databse connection works
SQLconnection.authenticate();
console.log("Success! Connection to database is working!");

//export the db connection function.
module.exports = SQLconnection;