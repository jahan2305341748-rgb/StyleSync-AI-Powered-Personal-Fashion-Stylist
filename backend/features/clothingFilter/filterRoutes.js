// Feature 4: Search by name and filter by type, color, season, occasion
const router = require("express").Router();
const { Op } = require("sequelize");
const { Clothing, DigitalWardrobe } = require("../../models");
const auth = require("../../middleware/auth");
const wrap = require("../../middleware/wrap");

router.get("/search", auth, wrap(async (req, res) => {
  const { search = "", type = "", color = "", season = "", occasion = "" } = req.query;

  // like = search; MySQL ignores capital letters by default; empty filter matches everything
  const items = await Clothing.findAll({
    where: {
      user_id: req.userId,
      name: { [Op.like]: `%${search}%` },
      type: { [Op.like]: `%${type}%` },
      color: { [Op.like]: `%${color}%` },
      season: { [Op.like]: `%${season}%` },
      occasion: { [Op.like]: `%${occasion}%` },
    },
    include: [{ model: DigitalWardrobe, required: true, attributes: [] }],
    order: [["clothing_id", "DESC"]],
  });
  res.json(items);
}));

module.exports = router;
