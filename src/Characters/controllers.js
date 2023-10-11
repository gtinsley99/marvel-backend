const Character = require("./model");

const addCharacter = async (req, res) => {
    try {
        const char = await Character.create({
            name: req.body.name,
            image: req.body.image,
            description: req.body.description,
            marvelID: req.body.marvelID,
        })
        res.status(200).json({
            message: "success",
            name: char.name,
            image: char.image,
            description: char.description,
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

module.exports = {
    addCharacter,
}