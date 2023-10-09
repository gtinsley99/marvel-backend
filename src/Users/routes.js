const { Router } = require("express");
const userRouter = Router();
const {registerUser, loginUser, loginWithToken, updateEmail, updatePassword, deleteUser, updateUsername} = require("./controllers");
const {hashPassword, passwordCheck, tokenCheck} = require("../middleware/index");

// Route to add a user, password hashed before add to db
userRouter.post("/register", hashPassword, registerUser);

// Route to login and create token
userRouter.post("/login", passwordCheck, loginUser);

// Route to login with token
userRouter.get("/loginwithtoken", tokenCheck, loginWithToken);

// Route to update email with token check
userRouter.put("/updateemail", tokenCheck, updateEmail);

// Route to update password with password check
userRouter.put("/updatepassword", passwordCheck, hashPassword, updatePassword);

// Route to update username with token check
userRouter.put("/updateusername", tokenCheck, updateUsername);

// Request to delete user with password check
userRouter.delete("/deleteuser", passwordCheck, deleteUser);

module.exports = userRouter;

