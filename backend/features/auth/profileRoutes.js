// Feature 1b: View and update the user profile
const router = require("express").Router();
const { User } = require("../../models");
const auth = require("../../middleware/auth");
const upload = require("../../middleware/upload");
const wrap = require("../../middleware/wrap");

router.get("/", auth, wrap(async (req, res) => {
  const user = await User.findByPk(req.userId, {
    attributes: ["user_id", "name", "email", "phone", "profile_picture"],
  });
  res.json(user);
}));

router.put("/", auth, upload.single("photo"), wrap(async (req, res) => {
  const { name, email, phone } = req.body;
  const changes = { name, email, phone };
  if (req.file) changes.profile_picture = "/uploads/" + req.file.filename; // only when a new photo is sent

  await User.update(changes, { where: { user_id: req.userId } });
  res.json({ message: "Profile saved" });
}));

module.exports = router;
