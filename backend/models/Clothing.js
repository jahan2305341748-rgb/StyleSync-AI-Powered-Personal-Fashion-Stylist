const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

module.exports = sequelize.define("Clothing", {
  clothing_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: DataTypes.INTEGER,
  name: DataTypes.STRING,
  brand: DataTypes.STRING,
  type: DataTypes.STRING,
  color: DataTypes.STRING,
  season: DataTypes.STRING,
  occasion: DataTypes.STRING,
  image_url: DataTypes.STRING,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: "clothing", timestamps: false });
