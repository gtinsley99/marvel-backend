const Character = require("./model");

const addCharacter = async (req, res) => {
    try {
        const char = await Character.create({
            name: req.body.name,
            count: 0
        })
        res.status(200).json({
            message: "success",
            name: char.name
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