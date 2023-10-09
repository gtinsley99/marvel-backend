const Character = require ("./model");


const addCharacter = async (req, res) => {
    try {
        const character = await Character.create({
            name: req.body.name,
            image: req.body.image,
        });

        res.status(201).json({
            message: "User registered",
            user: {
              name: character.name,
              image: character.image,
              id: req.body.id
            },
          });
    } catch (error) {
        console.log(error);
        res.status(501).json({
          message: error.message,
          detail: error
        }); 
    }
};

const delCharacter = async (req, res) => {
    try {
        const character = await Character.findOne({ where: {name: req.body.name}});

        if (!character) {
            throw new Error("The character was not found in database.");
        } else {
            await character.destroy();
            res.status(200).json({
                message: "Character has been successfully deleted from the database",
                name: req.body.name,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(501).json({
            message: "Error occured. Please try again!",
            error: error,
      }); 
    }
}

module.exports = {
    addCharacter,
    delCharacter
};