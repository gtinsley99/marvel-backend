const { Router } = require("express");
const userRouter = Router();
const {} = require("./controllers");
const {hashPassword, passwordCheck, tokenCheck} = require("../middleware/index");

// Route to add a user, password hashed before add to db
userRouter.post("/users/register", hashPassword, registerUser);

