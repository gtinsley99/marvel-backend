const Character = require("./model");

const addCharacter = async (req, res) => {
    try {
        const char = await Character.create({
            name: req.body.name,
            image: req.body.image,
            marvelID: req.body.marvelID,
        })
        res.status(200).json({
            message: "success",
            name: char.name,
            image: char.image,
            marvelID: char.marvelID
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
          message: error.message,
          detail: error,
        });
    }
};

const getAll = async (req, res) => {
    try {
        const char = await Character.findAll({});
        res.status(200).json({
            message: "success",
            characters: char
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
          message: error.message,
          detail: error,
        });
    }
};

const getOne = async (req, res) => {
    try {
        const char = await Character.findOne({where: {name: req.params.name}});
        res.status(200).json({
            message: "success",
            character: char
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
          message: error.message,
          detail: error,
        });
    }
};

module.exports = {
    addCharacter,
    getAll,
    getOne
}