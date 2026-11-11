// Feature 3: Upload, view, edit and delete clothes
const router = require("express").Router();
const { Clothing, DigitalWardrobe } = require("../../models");
const auth = require("../../middleware/auth");
const upload = require("../../middleware/upload");
const wrap = require("../../middleware/wrap");

// View all clothes of the logged in user
router.get("/", auth, wrap(async (req, res) => {
  const items = await Clothing.findAll({
    where: { user_id: req.userId },
    include: [{ model: DigitalWardrobe, required: true, attributes: [] }], // only items in the wardrobe
    order: [["clothing_id", "DESC"]],
  });
  res.json(items);
}));

// Add a new item (saved in clothing and in digital_wardrobe)
router.post("/", auth, upload.single("image"), wrap(async (req, res) => {
  const { name, brand, type, color, season, occasion } = req.body;
  const image_url = req.file ? "/uploads/" + req.file.filename : "";

  const item = await Clothing.create({ user_id: req.userId, name, brand, type, color, season, occasion, image_url });
  await DigitalWardrobe.create({ user_id: req.userId, clothing_id: item.clothing_id });
  res.json({ message: "Item added" });
}));

// Edit an item
router.put("/:id", auth, upload.single("image"), wrap(async (req, res) => {
  const { name, brand, type, color, season, occasion } = req.body;
  const changes = { name, brand, type, color, season, occasion };
  if (req.file) changes.image_url = "/uploads/" + req.file.filename;

  await Clothing.update(changes, { where: { clothing_id: req.params.id, user_id: req.userId } });
  res.json({ message: "Item updated" });
}));

// Delete an item (its digital_wardrobe row is removed automatically)
router.delete("/:id", auth, wrap(async (req, res) => {
  await Clothing.destroy({ where: { clothing_id: req.params.id, user_id: req.userId } });
  res.json({ message: "Item deleted" });
}));

module.exports = router;
