const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

module.exports = sequelize.define("FashionProfile", {
  profile_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, unique: true },
  body_type: { type: DataTypes.STRING, defaultValue: "average" },
  skin_color: { type: DataTypes.STRING, defaultValue: "#e0ac69" },
  top_color: { type: DataTypes.STRING, defaultValue: "#c0392b" },
  bottom_color: { type: DataTypes.STRING, defaultValue: "#2c3e50" },
  style: { type: DataTypes.STRING, defaultValue: "casual" },
  preferred_styles: DataTypes.STRING,
  preferred_occasion: DataTypes.STRING,
  favorite_colors: DataTypes.STRING,
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: "fashion_profiles", timestamps: false });
