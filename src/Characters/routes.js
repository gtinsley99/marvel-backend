// import express and use router methods
const { Router } = require("express");
const charRouter = Router();

//import controllers for characters
const {addCharacter, delCharacter} = require("./controllers");

//route to add character to db
charRouter.post("/addCharacter", addCharacter);

//route to delete character from db
charRouter.delete("/delCharacter", delCharacter);