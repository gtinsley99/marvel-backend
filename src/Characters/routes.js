const { Router } = require("express");
const charRouter = Router();

const {addCharacter} = require("./controllers");

// Route to add character
charRouter.post("/add", addCharacter);

module.exports = charRouter;