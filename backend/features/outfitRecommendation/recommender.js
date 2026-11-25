// Outfit recommendation + color match logic (plain functions, no Express code here).
const { parseColor, harmony, paletteFor } = require("./colors");

// Which occasions each outfit style from the fashion profile usually means
const STYLE_OCCASIONS = { casual: ["Everyday", "Date"], formal: ["Office", "Wedding"], sporty: ["Gym", "Everyday"] };
// "Everyday" clothes are also fine for these occasions
const EVERYDAY_FLEX = ["Everyday", "Office", "Date"];
// Which clothing types go with a given type (used by color match)
const GOES_WITH = {
  Top: ["Bottom", "Shoes", "Outerwear", "Accessory"],
  Bottom: ["Top", "Shoes", "Outerwear", "Accessory"],
  Dress: ["Shoes", "Outerwear", "Accessory"],
};

function splitWords(text) {
  return String(text || "").replace(/;/g, ",").split(",").map((w) => w.trim().toLowerCase()).filter(Boolean);
}

function fitsOccasion(item, occasion) {
  if (!occasion) return true;
  const itemOccasion = item.occasion || "Everyday";
  return itemOccasion === occasion || (itemOccasion === "Everyday" && EVERYDAY_FLEX.includes(occasion));
}

function fitsSeason(item, season) {
  if (!season || season === "All season") return true;
  const itemSeason = item.season || "All season";
  return itemSeason === season || itemSeason === "All season";
}

function pairScore(first, second) {
  return harmony(parseColor(first.color), parseColor(second.color));
}

function averageHarmony(pieces) {
  const scores = [];
  for (let i = 0; i < pieces.length; i++) {
    for (let j = i + 1; j < pieces.length; j++) scores.push(pairScore(pieces[i], pieces[j])[0]);
  }
  return scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0.5;
}

// Pick the candidate (shoes, outerwear, accessory) that matches the base outfit best
function bestExtra(base, candidates, minimum) {
  let best = null, bestScore = 0;
  candidates.forEach((candidate) => {
    const score = averageHarmony([...base, candidate]);
    if (score > bestScore) { best = candidate; bestScore = score; }
  });
  return best && bestScore >= minimum ? best : null;
}

function share(pieces, test) {
  return pieces.filter(test).length / pieces.length;
}

function scoreOutfit(pieces, profile, occasion) {
  const harmonyPart = averageHarmony(pieces);

  let occasionPart = 0.7;
  if (occasion) occasionPart = share(pieces, (p) => fitsOccasion(p, occasion));
  else if (profile.preferred_occasion) occasionPart = share(pieces, (p) => fitsOccasion(p, profile.preferred_occasion));

  const favoriteColors = splitWords(profile.favorite_colors);
  const styleWords = splitWords(profile.preferred_styles);
  const styleOccasions = STYLE_OCCASIONS[profile.style] || [];

  const favoriteShare = share(pieces, (p) => favoriteColors.some((c) => String(p.color || "").toLowerCase().includes(c)));
  const styleShare = share(pieces, (p) => styleOccasions.includes(p.occasion));
  const wordShare = share(pieces, (p) => {
    const text = (String(p.name || "") + " " + String(p.brand || "")).toLowerCase();
    return styleWords.some((w) => text.includes(w));
  });
  const preferencePart = 0.5 * favoriteShare + 0.35 * styleShare + 0.15 * wordShare;

  return 55 * harmonyPart + 20 * occasionPart + 25 * preferencePart;
}

function explain(pieces, profile, occasion, season) {
  const reasons = [];
  if (pieces.length >= 2) {
    reasons.push((pieces[0].color || "top") + " with " + (pieces[1].color || "bottom") + ": " + pairScore(pieces[0], pieces[1])[1]);
  }
  const liked = splitWords(profile.favorite_colors).filter((c) => pieces.some((p) => String(p.color || "").toLowerCase().includes(c)));
  if (liked.length) reasons.push("Uses your favorite color: " + liked.join(", "));
  if (occasion) reasons.push("Suits the " + occasion + " occasion");
  if (season && season !== "All season") reasons.push("Works for " + season);
  return reasons;
}

function cleanItem(item) {
  const { clothing_id, name, brand, type, color, season, occasion, image_url } = item;
  return { clothing_id, name, brand, type, color, season, occasion, image_url };
}

// Main function 1: outfit suggestions
function recommend(profile, items, occasion = "", season = "", limit = 5) {
  const byType = {};
  items.forEach((item) => {
    if (fitsOccasion(item, occasion) && fitsSeason(item, season)) (byType[item.type] = byType[item.type] || []).push(item);
  });
  const tops = byType.Top || [], bottoms = byType.Bottom || [], dresses = byType.Dress || [];
  const shoes = byType.Shoes || [], outerwear = byType.Outerwear || [], accessories = byType.Accessory || [];

  const bases = [];
  tops.forEach((top) => bottoms.forEach((bottom) => bases.push([top, bottom])));
  dresses.forEach((dress) => bases.push([dress]));

  if (bases.length === 0) {
    let where = "";
    if (occasion) where += " for " + occasion;
    if (season && season !== "All season") where += " in " + season;
    return { outfits: [], message: "No Top + Bottom (or a Dress) found" + where + ". Add more clothes or change the filters." };
  }

  const candidates = bases.map((base) => {
    const pieces = [...base];
    const shoe = bestExtra(pieces, shoes, 0.6);
    if (shoe) pieces.push(shoe);
    // a coat is a must when it is cold or rainy, otherwise only when it matches well
    const coat = bestExtra(pieces, outerwear, season === "Winter" || season === "Rainy" ? 0.5 : 0.75);
    if (coat) pieces.push(coat);
    const accessory = bestExtra(pieces, accessories, 0.75);
    if (accessory) pieces.push(accessory);
    return { total: scoreOutfit(pieces, profile, occasion), pieces };
  });
  candidates.sort((a, b) => b.total - a.total);

  // keep some variety: one piece appears in at most 2 suggested outfits
  const used = {}, outfits = [];
  for (const { total, pieces } of candidates) {
    if (pieces.some((p) => (used[p.clothing_id] || 0) >= 2)) continue;
    pieces.forEach((p) => { used[p.clothing_id] = (used[p.clothing_id] || 0) + 1; });
    outfits.push({ score: Math.round(total), items: pieces.map(cleanItem), reasons: explain(pieces, profile, occasion, season) });
    if (outfits.length >= limit) break;
  }
  return { outfits, message: "" };
}

// Main function 2: color mix-and-match
function match(colorText, items, baseType = "", excludeId = null) {
  const base = parseColor(colorText);
  if (!base) return { error: "I do not know the color '" + colorText + "'. Try a simple name like navy, olive or beige." };

  const allowed = GOES_WITH[baseType];
  const matches = [];
  items.forEach((item) => {
    if (item.clothing_id === excludeId) return;
    if (allowed && !allowed.includes(item.type)) return;
    const [score, label] = harmony(base, parseColor(item.color));
    if (score >= 0.6) matches.push({ ...cleanItem(item), score: Math.round(score * 100), label });
  });
  matches.sort((a, b) => b.score - a.score);

  return { base: { name: base.name, hex: base.hex }, palette: paletteFor(base), matches };
}

module.exports = { recommend, match, cleanItem, GOES_WITH };
