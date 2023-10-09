const {DataTypes} = require("sequelize");
const connection = require("../db/connection");

const Character = connection.define("Character", {
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

module.exports = Character;