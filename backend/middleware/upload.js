// Saves uploaded images into the uploads folder
const multer = require("multer");
const path = require("path");
const fs = require("fs");

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

module.exports = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
  }),
});
