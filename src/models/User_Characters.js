const {DataTypes} = require("sequelize");
const connection = require("../db/connection");
const sequelize = require("sequelize");


const User_Characters = connection.define('User_Characters', {
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    CharacterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Characters',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'User_Characters',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "UserId" },
          { name: "CharacterId" },
        ]
      },
      {
        name: "CharacterId",
        using: "BTREE",
        fields: [
          { name: "CharacterId" },
        ]
      },
    ]
  });

module.exports = User_Characters;
