const User = require("../Users/model");
const User_Characters = require("../User_Characters/model");
const Character = require("../Characters/model");
const jwt = require("jsonwebtoken");
const {Sequelize} = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME,
process.env.DB_USERNAME, process.env.DB_PASSWORD,{
  host: process.env.DB_HOSTNAME,
  dialect: "mysql"
}
);


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
    } else if (error.errors[0].message === "email must be unique"){
      res.status(400).json({
        message: "Email address taken",
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
        profilePic: user.profilePic,
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
        profilePic: userDetails.profilePic
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
      throw new Error(res.status(400).json({message: "Email address must be different from current email"}));
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
    if (!user || req.user.username !== req.body.username) {
      throw new Error(res.status(400).json({
        message: "Username or password incorrect"
      }));
    } else {
      await User_Characters.destroy({where: {UserId: user.id}});
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
      throw new Error(res.status(400).json({message: "Same as current username"}));
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
    } else{
      throw new Error(res.status(501).json({message: "User or character not found"}));
    }
    res.status(201).json({
      username: user.username,
      character: character.name
    });
  } catch (error) {
      console.log(error);
      if (error.errors[0].message === "PRIMARY must be unique"){
        res.status(501).json({
          message: "Character already favourited",
        })
      }
    res.status(501).json({
      message: error.message,
      detail: error,
    });
  }
}

const deleteFav = async (req, res) => {
  try {
    const user = await User.findOne({where: {username: req.user.username}});
    const character = await Character.findOne({where: {name: req.body.name}});
    const userChar = await User_Characters.findOne({where:{
      UserId: user.id,
      CharacterId: character.id
    }})
    if (userChar){
      await userChar.destroy();
    } else{
      throw new Error(res.status(400).json({message: "Character not favourited"}));
    };
   
    res.status(200).json({
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
};

const popular = async (req, res) => {
 try {
  let pop = await sequelize.query("SELECT `CharacterId` FROM `User_Characters` GROUP BY `CharacterId` ORDER BY COUNT(*) DESC LIMIT 3");
  pop = pop[0];
  let char = [];
  for (let i=0; i<pop.length; i++){
    char.push(Object.values(pop[i]));
  };
  let allName = [];
  for (let i=0; i<char.length; i++){
  let names = await Character.findOne({where: {id: char[i]}, attributes: ["name", "image"]});
  allName.push(names);
  }
  res.status(200).json({
    message: "Favourites characters",
    characters: allName
  })
 } catch (error) {
  console.log(error);
  res.status(501).json({
    message: error.message,
    detail: error,
  });
 };
};

const isFav = async (req, res) => {
  try {
    const char = await Character.findOne({where: {name: req.params.name}});
    const fav = await User_Characters.findOne({where: {UserId: req.user.id, CharacterId: char.id}});
    if (fav){
      res.status(200).json({
        message: "Is a favourite",
        character: char.name
      })
    } else{
      res.status(200).json({
        message: "Is not a favourite",
        character: char.name
      })
    }
 
  } catch (error) {
   console.log(error);
   res.status(501).json({
     message: error.message,
     detail: error,
   });
  };
 };

 const getFavs = async (req, res) => {
  try {
    const fav = await User_Characters.findAll({where: {UserId: req.user.id}});
    if (!fav){
      res.status(200).json({
        message: "No favourites",
        user: req.user.username
      })
    } 
      let charArr = [];
      for (let i = 0; i<fav.length; i++){
      let char = await Character.findOne({where: {id: fav[i].CharacterId}, attributes: ["name", "image"]});
      charArr.push(char);
    }
    console.log(fav);
      res.status(200).json({
        message: "All favourite",
        favourites: charArr
      })
  } catch (error) {
   console.log(error);
   res.status(501).json({
     message: error.message,
     detail: error,
   });
  };
 };

 const updatePic = async (req, res) => {
  try {
    const userDetails = await User.findOne({where: {username: req.user.username}});
    await userDetails.update({
      profilePic: req.files.blob.data,
    });
    await userDetails.save();
    console.log(userDetails.profilePic);
    res.status(200).json({
      message: "Profile pic updated",
      profilePic: userDetails.profilePic
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({
      message: error.message,
      detail: error,
    });
  };
 };
 

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
  isFav,
  getFavs,
  updatePic
};
