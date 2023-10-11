const { Router } = require("express");
const charRouter = Router();

const {addCharacter, getAll, getOne} = require("./controllers");

// Route to add character
charRouter.post("/add", addCharacter);

// Route to get all characters
charRouter.get("/all", getAll);

// Route to find one character by name
charRouter.get("/one/:name", getOne);

module.exports = charRouter;