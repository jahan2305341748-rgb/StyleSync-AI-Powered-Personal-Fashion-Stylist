// Color helpers: turn a color word or hex into hue/saturation/lightness
// and score how well two colors go together (simple color theory).

const NAMED = {
  black: "#111111", white: "#f5f5f5", grey: "#808080", gray: "#808080",
  charcoal: "#36454f", silver: "#c0c0c0", beige: "#d9c7a3", cream: "#f3ead3",
  khaki: "#a39a6b", tan: "#c8a26b", brown: "#6b4423", camel: "#c19a6b",
  navy: "#1f2a55", denim: "#4a6fa5", blue: "#2980b9", "sky blue": "#87ceeb",
  "light blue": "#a9cce3", teal: "#1b8a8a", turquoise: "#30b8b0",
  green: "#27ae60", olive: "#6b7a2a", mint: "#a8e6cf", lime: "#9acd32",
  yellow: "#f1c40f", mustard: "#d4a017", gold: "#d4af37", orange: "#e67e22",
  coral: "#ff7f6e", peach: "#ffcba4", red: "#c0392b", maroon: "#7b1e2b",
  burgundy: "#800020", pink: "#f48fb1", rose: "#e9a6a6", magenta: "#c2185b",
  purple: "#8e44ad", violet: "#7e57c2", lavender: "#b39ddb",
};

// These go with almost everything
const NEUTRAL_NAMES = ["black", "white", "grey", "gray", "charcoal", "silver", "beige", "cream", "khaki", "tan", "brown", "camel", "navy", "denim"];

function hexToRgb(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

function rgbToHex(rgb) {
  return "#" + rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}

// rgb (0-255) -> hue 0-360, saturation 0-1, lightness 0-1
function rgbToHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return { h: h * 60, s, l };
}

// hue 0-360, saturation 0-1, lightness 0-1 -> rgb (0-255)
function hslToRgb(h, s, l) {
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}

// Closest known color name for a hex value (labels suggested colors)
function nearestName(hex) {
  const target = hexToRgb(hex);
  let best = "", bestDistance = Infinity;
  Object.keys(NAMED).forEach((name) => {
    const rgb = hexToRgb(NAMED[name]);
    const distance = rgb.reduce((sum, v, i) => sum + (v - target[i]) ** 2, 0);
    if (distance < bestDistance) { best = name; bestDistance = distance; }
  });
  return best;
}

// Returns { hex, h, s, l, neutral, name } or null when the color is not understood
function parseColor(text) {
  if (!text) return null;
  text = String(text).trim().toLowerCase();
  let name = null, hex;

  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(text)) {
    hex = text;
  } else if (NAMED[text]) {
    name = text;
    hex = NAMED[text];
  } else {
    // "dark blue", "light grey" ... use the longest known color word inside the text
    const found = Object.keys(NAMED).filter((word) => new RegExp("\\b" + word + "\\b").test(text));
    if (found.length === 0) return null;
    name = found.sort((a, b) => b.length - a.length)[0];
    hex = NAMED[name];
  }

  const { h, s, l } = rgbToHsl(hexToRgb(hex));
  const neutral = NEUTRAL_NAMES.includes(name) || s < 0.15 || l < 0.12 || l > 0.9;
  return { hex, h, s, l, neutral, name: name || nearestName(hex) };
}

// Score 0..1 and a short label for two parsed colors
function harmony(first, second) {
  if (!first || !second) return [0.5, "unknown color"];
  if (first.neutral && second.neutral) return [0.85, "neutral pair"];
  if (first.neutral || second.neutral) return [0.9, "neutral with a color"];

  let gap = Math.abs(first.h - second.h);
  gap = Math.min(gap, 360 - gap);
  if (gap <= 15) {
    if (Math.abs(first.l - second.l) >= 0.15) return [0.85, "monochrome (light and dark of one color)"];
    return [0.6, "almost the same color"];
  }
  if (gap <= 45) return [0.8, "analogous (neighbor colors)"];
  if (gap >= 150) return [0.9, "complementary (opposite colors)"];
  if (gap >= 100 && gap <= 140) return [0.7, "triadic (balanced contrast)"];
  return [0.4, "risky mix"];
}

// Colors that go well with one parsed color: [{ role, hex, name }]
function paletteFor(color) {
  if (color.neutral) {
    return ["white", "grey", "olive", "burgundy", "mustard", "sky blue"].map((name) => ({ role: "goes with anything", hex: NAMED[name], name }));
  }
  const suggestions = [];
  const rotated = (degrees) => {
    const hue = (color.h + degrees + 360) % 360;
    const lightness = Math.min(Math.max(color.l, 0.35), 0.65);
    const saturation = Math.min(Math.max(color.s, 0.4), 0.8);
    return rgbToHex(hslToRgb(hue, saturation, lightness));
  };
  [["complementary", 180], ["analogous", 30], ["analogous", -30], ["triadic", 120], ["triadic", 240]].forEach(([role, degrees]) => {
    const hex = rotated(degrees);
    suggestions.push({ role, hex, name: nearestName(hex) });
  });
  ["white", "black", "beige", "denim"].forEach((name) => suggestions.push({ role: "neutral", hex: NAMED[name], name }));
  return suggestions;
}

module.exports = { parseColor, harmony, paletteFor };
