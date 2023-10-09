const {DataTypes} = require("sequelize");
const connection = require("../db/connection");

const Character = connection.define("Character", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
});

module.exports = Character;