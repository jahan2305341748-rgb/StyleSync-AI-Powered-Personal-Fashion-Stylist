// Module 2: outfit suggestions + color mix-and-match
// Loads the user's data from MySQL and gives it to the recommender (recommender.js). Pure Node.js.
const router = require("express").Router();
const { FashionProfile, Clothing, DigitalWardrobe } = require("../../models");
const auth = require("../../middleware/auth");
const wrap = require("../../middleware/wrap");
const { recommend, match } = require("./recommender");
const { aiRecommend, aiColorMatch, isAiConfigured } = require("./aiStylist");

// Only the logged-in user's own wardrobe items
async function loadWardrobe(userId) {
  const items = await Clothing.findAll({
    where: { user_id: userId },
    include: [{ model: DigitalWardrobe, required: true, attributes: [] }],
  });
  return items.map((item) => item.get({ plain: true }));
}

// 1) Outfit suggestions:  GET /api/outfits/recommend?occasion=Office&season=Winter
router.get("/recommend", auth, wrap(async (req, res) => {
  const { occasion = "", season = "" } = req.query;
  const profile = await FashionProfile.findOne({ where: { user_id: req.userId }, raw: true });
  const items = await loadWardrobe(req.userId);

  if (items.length === 0) {
    return res.json({ outfits: [], message: "Your wardrobe is empty. Add some clothes first." });
  }
  res.json(recommend(profile || {}, items, occasion, season, 5));
}));

// 1b) AI outfit suggestions:  GET /api/outfits/ai-recommend?occasion=Office&season=Winter
// Same response shape as /recommend plus { source: "ai" | "rules" }. Falls back to the rule-based
// recommender when no API key is set or the AI call fails, so the screen never breaks.
router.get("/ai-recommend", auth, wrap(async (req, res) => {
  const { occasion = "", season = "" } = req.query;
  const profile = (await FashionProfile.findOne({ where: { user_id: req.userId }, raw: true })) || {};
  const items = await loadWardrobe(req.userId);

  if (items.length === 0) {
    return res.json({ outfits: [], message: "Your wardrobe is empty. Add some clothes first.", source: "rules" });
  }
  if (isAiConfigured()) {
    try {
      return res.json({ ...(await aiRecommend(profile, items, occasion, season, 5)), source: "ai" });
    } catch (err) {
      console.error("AI stylist failed, using rules:", err.message);
    }
  }
  res.json({ ...recommend(profile, items, occasion, season, 5), source: "rules" });
}));

// Works out the base color from ?clothing_id=3 or ?color=navy. Sends the error itself and returns null when it fails.
function resolveBase(req, res, items) {
  let color = req.query.color || "";
  let baseType = "";
  let excludeId = null;

  if (req.query.clothing_id) {
    const base = items.find((item) => String(item.clothing_id) === String(req.query.clothing_id));
    if (!base) { res.status(404).json({ message: "Item not found in your wardrobe." }); return null; }
    color = base.color;
    baseType = base.type;
    excludeId = base.clothing_id;
  }
  if (!color) { res.status(400).json({ message: "Choose an item (with a color) or a color." }); return null; }
  return { color, baseType, excludeId };
}

// 2) Color mix-and-match (rules):  GET /api/outfits/match?clothing_id=3   or   ?color=navy
router.get("/match", auth, wrap(async (req, res) => {
  const items = await loadWardrobe(req.userId);
  const base = resolveBase(req, res, items);
  if (!base) return;

  const result = match(base.color, items, base.baseType, base.excludeId);
  if (result.error) return res.status(400).json({ message: result.error });
  res.json(result);
}));

// 2b) Color mix-and-match (AI):  GET /api/outfits/ai-match?clothing_id=3   or   ?color=dusty rose
// Same response shape as /match plus { source: "ai" | "rules" }. Understands any color description.
// Falls back to the rule-based /match logic when no AI is set up or the AI call fails.
router.get("/ai-match", auth, wrap(async (req, res) => {
  const items = await loadWardrobe(req.userId);
  const base = resolveBase(req, res, items);
  if (!base) return;

  if (isAiConfigured()) {
    try {
      return res.json({ ...(await aiColorMatch(base.color, items, base.baseType, base.excludeId)), source: "ai" });
    } catch (err) {
      console.error("AI color match failed, using rules:", err.message);
    }
  }
  const result = match(base.color, items, base.baseType, base.excludeId);
  if (result.error) return res.status(400).json({ message: result.error });
  res.json({ ...result, source: "rules" });
}));

module.exports = router;