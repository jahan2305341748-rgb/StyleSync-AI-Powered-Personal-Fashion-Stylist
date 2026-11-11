const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

module.exports = sequelize.define("DigitalWardrobe", {
  wardrobe_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: DataTypes.INTEGER,
  clothing_id: DataTypes.INTEGER,
  added_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: "digital_wardrobe", timestamps: false });
