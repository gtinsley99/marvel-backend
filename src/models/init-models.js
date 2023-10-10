var DataTypes = require("sequelize").DataTypes;
var _User_Characters = require("./User_Characters");

function initModels(sequelize) {
  var User_Characters = _User_Characters(sequelize, DataTypes);

  Characters.belongsToMany(Users, { as: 'UserId_Users', through: User_Characters, foreignKey: "CharacterId", otherKey: "UserId" });
  Users.belongsToMany(Characters, { as: 'CharacterId_Characters', through: User_Characters, foreignKey: "UserId", otherKey: "CharacterId" });
  User_Characters.belongsTo(Characters, { as: "Character", foreignKey: "CharacterId"});
  Characters.hasMany(User_Characters, { as: "User_Characters", foreignKey: "CharacterId"});
  User_Characters.belongsTo(Users, { as: "User", foreignKey: "UserId"});
  Users.hasMany(User_Characters, { as: "User_Characters", foreignKey: "UserId"});

  return {
    User_Characters,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
