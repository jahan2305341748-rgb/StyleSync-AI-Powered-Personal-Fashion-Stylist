const sequelize = require("../config/db");
const User = require("./User");
const FashionProfile = require("./FashionProfile");
const Clothing = require("./Clothing");
const DigitalWardrobe = require("./DigitalWardrobe");

User.hasOne(FashionProfile, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(Clothing, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(DigitalWardrobe, { foreignKey: "user_id", onDelete: "CASCADE" });
Clothing.hasMany(DigitalWardrobe, { foreignKey: "clothing_id", onDelete: "CASCADE" });
DigitalWardrobe.belongsTo(Clothing, { foreignKey: "clothing_id" });

module.exports = { sequelize, User, FashionProfile, Clothing, DigitalWardrobe };
