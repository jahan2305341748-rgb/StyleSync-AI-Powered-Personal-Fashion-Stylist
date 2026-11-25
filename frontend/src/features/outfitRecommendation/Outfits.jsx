import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api.js";
import { occasions, seasons } from "../wardrobe/options.js";

// Module 2: AI outfit suggestions from the user's wardrobe and fashion profile
export default function Outfits() {
  const [filters, setFilters] = useState({ occasion: "", season: "" });
  const [outfits, setOutfits] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [useAi, setUseAi] = useState(true);
  const [source, setSource] = useState("");

  // Ask the backend (which asks the Python AI) whenever a filter changes
  function load() {
    setLoading(true);
    setError("");
    api((useAi ? "/outfits/ai-recommend?" : "/outfits/recommend?") + new URLSearchParams(filters))
      .then((data) => { setOutfits(data.outfits); setMessage(data.message || ""); setSource(data.source || "rules"); })
      .catch((e) => { setOutfits([]); setError(e.message); })
      .finally(() => setLoading(false));
  }
  useEffect(load, [filters, useAi]);

  return (
    <div className="page">
      <Link to="/" className="back">Back to lobby</Link>
      <h2>Outfit recommendations</h2>

      <div className="panel">
        <div className="row">
          <select value={filters.occasion} onChange={(e) => setFilters({ ...filters, occasion: e.target.value })}>
            <option value="">Any occasion</option>
            {occasions.map((o) => <option key={o}>{o}</option>)}
          </select>
          <select value={filters.season} onChange={(e) => setFilters({ ...filters, season: e.target.value })}>
            <option value="">Any season</option>
            {seasons.map((s) => <option key={s}>{s}</option>)}
          </select>
          <label><input type="checkbox" checked={useAi} onChange={(e) => setUseAi(e.target.checked)} /> AI stylist</label>
          <button className="btn small" onClick={load}>Refresh</button>
          <Link to="/color-match" className="btn small ghost">Color mix and match</Link>
        </div>
      </div>

      {!loading && useAi && source === "rules" && outfits.length > 0 && <p className="muted">AI stylist is unavailable right now, showing standard suggestions.</p>}
      {loading && <p className="muted">Finding outfits...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && outfits.length === 0 && <p className="muted">{message || "No outfits yet."}</p>}

      {outfits.map((outfit, index) => (
        <div className="panel outfit" key={index}>
          <div className="outfit-head">
            <h4>Outfit {index + 1}</h4>
            <span className="score">{outfit.score}% match</span>
          </div>
          <div className="outfit-items">
            {outfit.items.map((item) => (
              <div className="outfit-piece" key={item.clothing_id}>
                {item.image_url ? <img src={item.image_url} alt={item.name} /> : <div className="noimg">No photo</div>}
                <strong>{item.name}</strong>
                <span className="muted">{item.type}, {item.color}</span>
              </div>
            ))}
          </div>
          <ul className="reasons">
            {outfit.reasons.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}
