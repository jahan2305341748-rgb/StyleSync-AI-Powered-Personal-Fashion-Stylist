// Feature 2: Fashion profile (character look + preferences)
const router = require("express").Router();
const { FashionProfile } = require("../../models");
const auth = require("../../middleware/auth");
const wrap = require("../../middleware/wrap");

router.get("/", auth, wrap(async (req, res) => {
  const profile = await FashionProfile.findOne({ where: { user_id: req.userId } });
  res.json(profile);
}));

router.put("/", auth, wrap(async (req, res) => {
  const f = req.body;
  await FashionProfile.update({
    body_type: f.body_type, skin_color: f.skin_color, top_color: f.top_color,
    bottom_color: f.bottom_color, style: f.style, preferred_styles: f.preferred_styles,
    preferred_occasion: f.preferred_occasion, favorite_colors: f.favorite_colors,
    updated_at: new Date(),
  }, { where: { user_id: req.userId } });
  res.json({ message: "Character saved" });
}));

module.exports = router;
