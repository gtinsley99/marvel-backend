const User = require("../Users/model");
const User_Characters = require("../models/User_Characters");
const Character = require("../Characters/model");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const token = jwt.sign({ id: user.id }, process.env.JWTPASSWORD, {
      expiresIn: "7d",
    });
    console.log(token);
    res.status(201).json({
      message: "User registered",
      user: {
        username: user.username,
        email: user.email,
        token: token,
      },
    });
  } catch (error) {
    console.log(error);
    if (error.errors[0].message === "username must be unique") {
      res.status(409).json({
        message: "Username taken",
      });
      return;
    } else if (error.errors[0].message === "Validation is on email failed") {
      res.status(400).json({
        message: "Invalid email address",
      });
      return;
    }
    res.status(501).json({
      message: error.message,
      detail: error,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.body.username } });
    const token = jwt.sign({ id: user.id }, process.env.JWTPASSWORD, {
      expiresIn: "7d",
    });
    console.log(token);
    res.status(201).json({
      message: "User logged in",
      user: {
        username: user.username,
        email: user.email,
        favourite: user.favourite,
        token: token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({
      message: error.message,
      detail: error,
    });
  }
};

const loginWithToken = async (req, res) => {
  try {
    const userDetails = await User.findOne({
      where: { username: req.user.username },
    });
    res.status(201).json({
      message: "User logged in",
      user: {
        username: userDetails.username,
        email: userDetails.email,
        favourite: userDetails.favourite
      },
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({
      message: error.message,
      detail: error,
    });
  }
};

const updateEmail = async (req, res) => {
  try {
    const userDetails = await User.findOne({
      where: { username: req.user.username },
    });
    if (userDetails.email === req.body.newemail) {
      throw new Error("Email address must be different from current email");
    }
    await userDetails.update({
      email: req.body.newemail,
    });
    await userDetails.save();
    res.status(200).json({
      message: "User email updated",
      username: req.body.username,
      email: req.body.newemail,
    });
  } catch (error) {
    console.log(error);
    if (error.errors) {
      if (error.errors[0].message === "Validation is on email failed") {
        res.status(400).json({
          message: "Invalid email address",
        });
        return;
      } else if (error.errors[0].message === "email must be unique") {
        res.status(400).json({
          message: "Email taken",
        });
        return;
      }
    }
    res.status(501).json({
      message: error.message,
      detail: error,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const userDetails = await User.findOne({
      where: { username: req.body.username },
    });
    await userDetails.update({
      password: req.body.password,
    });
    await userDetails.save();
    res.status(200).json({
      message: "User password updated",
      username: req.body.username,
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({
      message: error.message,
      detail: error,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.body.username } });
    if (!user) {
      throw new Error("Username or password incorrect");
    } else {
      await user.destroy();
      res.status(200).json({
        message: "User deleted",
        username: req.body.username,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json({
      message: "Error occurred",
      error: error,
    });
  }
};

const updateUsername = async (req, res) => {
  try {
    const userDetails = await User.findOne({
      where: { username: req.user.username },
    });
    if (userDetails.username === req.body.newusername) {
      throw new Error("Same as current username");
    }
    await userDetails.update({
      username: req.body.newusername,
    });
    await userDetails.save();
    res.status(200).json({
      message: "Username updated",
      username: userDetails.username,
    });
  } catch (error) {
    console.log(error);
    if (error.errors) {
      if (error.errors[0].message === "username must be unique") {
        res.status(400).json({
          message: "Username taken",
        });
        return;
      }
    }
    res.status(501).json({
      message: error.message,
      detail: error,
    });
  }
};

const findUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { username: req.params["username"] },
    });
    res.status(200).json({
      message: "User found",
      username: user.username,
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({
      message: "User not found",
      error: error,
    });
  }
};

const addFavourite = async (req, res) => {
  try {
    const user = await User.findOne({where: {username: req.user.username}});
    const character = await Character.findOne({where: {name: req.body.name}});
    if (user && character){
      await User_Characters.create({
        UserId: user.id,
        CharacterId: character.id
      })
    };
    res.status(201).json({
      username: user.username,
      character: character.name
    });
  } catch (error) {
      console.log(error);
    res.status(501).json({
      message: error.message,
      detail: error,
    });
  }
}

// const addFavourite = async (req, res) => {
//   try {
//     const user = await User.findOne({ where: { username: req.user.username } });
//     console.log(user);
//     if (user.favourite === null || user.favourite.length === 0) {
//       await user.update({
//         favourite: req.body.name,
//       });
//     } else {
//       await user.update({
//         favourite: `${user.favourite},${req.body.name}`,
//       });
//     }
//     const character = await Character.findOne({where: {name: req.body.name}});
//     console.log(character);
//     await character.update({
//       count: character.count + 1
//     });
//     res.status(200).json({
//       message: "Success",
//       favourite: user.favourite,
//       count: character.count
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(501).json({
//       message: error.message,
//       detail: error,
//     });
//   }
// };

const deleteFav = async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.user.username } });
    let favs = user.favourite;
    favs = favs.split(",");
    favRemoveIndex = favs.findIndex((name) => name === req.body.name);
    if (favRemoveIndex === -1){
      throw new Error("Not in favourites");
    };
    favs.splice(favRemoveIndex, 1);
    await user.update({
      favourite: favs.join(",")
    })
    await user.save();
    const character = await Character.findOne({where: {name: req.body.name}});
    await character.update({
      count: character.count - 1
    });
    res.status(200).json({
      message: "success",
      favourite: user.favourite,
      count: character.count
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({
      message: error.message,
      detail: error,
    });
  }
};

const popular = async (req, res) => {
  try {
    let arr = [];
    let char = await Character.findAll({});
    char.forEach((element) => arr.push(element.count))
    arr.sort((a, b) => (b - a));
    let popArr = [];
    for (let i = 0; i < 5; i++){
      popArr.push(await Character.findOne({where: {count: arr[i]}}));
    }
    res.status(200).json({
      characters: popArr.map((char) => char.name)
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({
      message: error.message,
      detail: error,
    });
  }
}

module.exports = {
  registerUser,
  loginUser,
  loginWithToken,
  updateEmail,
  updatePassword,
  deleteUser,
  updateUsername,
  findUser,
  addFavourite,
  deleteFav,
  popular,
};
