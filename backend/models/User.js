const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

module.exports = sequelize.define("User", {
  user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  phone: DataTypes.STRING,
  gender: DataTypes.STRING,
  date_of_birth: DataTypes.DATEONLY,
  profile_picture: DataTypes.STRING,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: "users", timestamps: false });
