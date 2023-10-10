const {DataTypes} = require("sequelize");
const connection = require("../db/connection");

const Character = connection.define("Character", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

module.exports = Character;