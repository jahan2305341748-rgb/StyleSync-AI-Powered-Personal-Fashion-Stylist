// Feature 1a: Register and Login (password hashing + JWT)
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, FashionProfile } = require("../../models");
const wrap = require("../../middleware/wrap");

function makeToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

router.post("/register", wrap(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

  const exists = await User.findOne({ where: { email } });
  if (exists) return res.status(400).json({ message: "This email is already registered" });

  const user = await User.create({ email, password_hash: bcrypt.hashSync(password, 10) });

  // every new user gets an empty fashion profile
  await FashionProfile.create({ user_id: user.user_id });
  res.json({ token: makeToken(user.user_id) });
}));

router.post("/login", wrap(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user || !bcrypt.compareSync(password, user.password_hash))
    return res.status(400).json({ message: "Wrong email or password" });
  res.json({ token: makeToken(user.user_id) });
}));

module.exports = router;
