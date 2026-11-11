// Checks the JWT token and sets req.userId
const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  try {
    req.userId = jwt.verify(token, process.env.JWT_SECRET).userId;
    next();
  } catch (e) {
    res.status(401).json({ message: "Please log in again" });
  }
};
