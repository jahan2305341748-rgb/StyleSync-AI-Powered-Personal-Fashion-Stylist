import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api.js";
import { types } from "../wardrobe/options.js";

const quickColors = ["black", "white", "grey", "beige", "navy", "blue", "green", "olive", "yellow", "orange", "red", "burgundy", "pink", "purple", "brown"];

// Module 2: AI color-compatible mix-and-match suggestions
export default function ColorMatch() {
  const [wardrobe, setWardrobe] = useState([]);
  const [clothingId, setClothingId] = useState("");
  const [color, setColor] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [useAi, setUseAi] = useState(true);
  const [custom, setCustom] = useState("");

  useEffect(() => { api("/wardrobe").then(setWardrobe).catch((e) => setError(e.message)); }, []);

  // Ask for matches when the user picks an item or a color
  useEffect(() => {
    if (!clothingId && !color) { setResult(null); return; }
    const query = clothingId ? { clothing_id: clothingId } : { color };
    setError("");
    setLoading(true);
    api((useAi ? "/outfits/ai-match?" : "/outfits/match?") + new URLSearchParams(query))
      .then(setResult)
      .catch((e) => { setResult(null); setError(e.message); })
      .finally(() => setLoading(false));
  }, [clothingId, color, useAi]);

  function pickItem(id) { setClothingId(id); setColor(""); }
  function pickColor(name) { setColor(name); setClothingId(""); }

  return (
    <div className="page">
      <Link to="/" className="back">Back to lobby</Link>
      <h2>Color mix and match</h2>

      <div className="panel">
        <label>Start from one of your clothes</label>
        <select value={clothingId} onChange={(e) => pickItem(e.target.value)}>
          <option value="">Choose an item</option>
          {wardrobe.map((item) => (
            <option key={item.clothing_id} value={item.clothing_id}>{item.name} ({item.type}, {item.color})</option>
          ))}
        </select>

        <label>Or pick a color</label>
        <div className="chips">
          {quickColors.map((name) => (
            <button key={name} className={"chip" + (color === name ? " active" : "")} onClick={() => pickColor(name)}>{name}</button>
          ))}
        </div>

        <label>Or type any color (AI understands things like "dusty rose")</label>
        <div className="row">
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="e.g. dark teal"
            onKeyDown={(e) => { if (e.key === "Enter" && custom.trim()) pickColor(custom.trim()); }}
          />
          <button className="btn small" onClick={() => custom.trim() && pickColor(custom.trim())}>Go</button>
        </div>

        <label><input type="checkbox" checked={useAi} onChange={(e) => setUseAi(e.target.checked)} /> AI stylist</label>
      </div>

      {loading && <p className="muted">Finding color matches...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && useAi && result && result.source === "rules" && (
        <p className="muted">AI stylist is unavailable right now, showing standard suggestions.</p>
      )}

      {result && (
        <>
          <div className="panel">
            <h4>Colors that go well with {result.base.name}</h4>
            <div className="palette">
              <div className="palette-chip">
                <span className="swatch" style={{ background: result.base.hex }} />
                <small>your color</small>
              </div>
              {result.palette.map((p, i) => (
                <div className="palette-chip" key={i}>
                  <span className="swatch" style={{ background: p.hex }} />
                  <small>{p.role}</small>
                </div>
              ))}
            </div>
          </div>

          <h4>From your wardrobe</h4>
          {result.matches.length === 0 && <p className="muted">Nothing in your wardrobe matches yet. Try the colors above when you shop.</p>}
          {types.map((type) => {
            const group = result.matches.filter((m) => m.type === type);
            if (group.length === 0) return null;
            return (
              <div key={type}>
                <h4 className="muted">{type}</h4>
                <div className="grid">
                  {group.map((item) => (
                    <div className="panel item" key={item.clothing_id}>
                      {item.image_url ? <img src={item.image_url} alt={item.name} /> : <div className="noimg">No photo</div>}
                      <h4>{item.name}</h4>
                      <p className="muted">{item.color}, {item.label}</p>
                      <span className="score">{item.score}% match</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}