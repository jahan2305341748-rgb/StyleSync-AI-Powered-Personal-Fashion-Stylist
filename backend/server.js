// StyleSync backend - Module 1 (Express + PostgreSQL)
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// One route file for each feature
app.use("/api", require("./features/auth/authRoutes"));                 // Feature 1
app.use("/api/profile", require("./features/auth/profileRoutes"));      // Feature 1
app.use("/api/fashion", require("./features/fashionProfile/fashionRoutes")); // Feature 2
app.use("/api/wardrobe", require("./features/clothingFilter/filterRoutes")); // Feature 4 (must come first)
app.use("/api/wardrobe", require("./features/wardrobe/wardrobeRoutes"));     // Feature 3

// Any error ends up here
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error. Please try again." });
});

sequelize.sync().then(() => {
  app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
}).catch((err) => console.error("Database error:", err.message));
