import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api.js";
import Character from "../../Character.jsx";

const bodyTypes = ["slim", "average", "athletic", "plus"];
const skins = ["#f5d5b8", "#e0ac69", "#c68642", "#8d5524", "#5c3a21"];
const colors = ["#c0392b", "#e67e22", "#f1c40f", "#27ae60", "#2980b9", "#8e44ad", "#ecf0f1", "#2c3e50", "#111111"];
const styles = ["casual", "formal", "sporty"];
const occasions = ["Everyday", "Office", "Party", "Wedding", "Gym", "Date"];

// A row of color circles to pick from
function ColorPicker({ list, value, onPick }) {
  return (
    <div className="swatches">
      {list.map((c) => (
        <div key={c} className={"swatch" + (c === value ? " active" : "")} style={{ background: c }} onClick={() => onPick(c)} />
      ))}
    </div>
  );
}

export default function Fashion() {
  const [f, setF] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => { api("/fashion").then(setF); }, []);
  if (!f) return <div className="page">Loading...</div>;

  function change(field, value) {
    setF({ ...f, [field]: value });
  }

  async function save() {
    await api("/fashion", "PUT", f);
    setMessage("Character saved");
  }

  return (
    <div className="page">
      <Link to="/" className="back">Back to lobby</Link>
      <h2>Customize your character</h2>
      <div className="two-col">
        <div className="panel preview">
          <Character bodyType={f.body_type} skin={f.skin_color} top={f.top_color} bottom={f.bottom_color} style={f.style} />
        </div>

        <div className="panel">
          <label>Body type</label>
          <div className="chips">
            {bodyTypes.map((b) => (
              <button key={b} className={"chip" + (f.body_type === b ? " active" : "")} onClick={() => change("body_type", b)}>{b}</button>
            ))}
          </div>

          <label>Skin color</label>
          <ColorPicker list={skins} value={f.skin_color} onPick={(c) => change("skin_color", c)} />

          <label>Outfit style</label>
          <div className="chips">
            {styles.map((s) => (
              <button key={s} className={"chip" + (f.style === s ? " active" : "")} onClick={() => change("style", s)}>{s}</button>
            ))}
          </div>

          <label>Top color</label>
          <ColorPicker list={colors} value={f.top_color} onPick={(c) => change("top_color", c)} />

          <label>Bottom color</label>
          <ColorPicker list={colors} value={f.bottom_color} onPick={(c) => change("bottom_color", c)} />

          <label>Preferred occasion</label>
          <select value={f.preferred_occasion || ""} onChange={(e) => change("preferred_occasion", e.target.value)}>
            <option value="">Choose one</option>
            {occasions.map((o) => <option key={o}>{o}</option>)}
          </select>

          <label>Preferred styles (for example: minimal, street, vintage)</label>
          <input value={f.preferred_styles || ""} onChange={(e) => change("preferred_styles", e.target.value)} />

          <label>Favorite colors (for example: black, olive, white)</label>
          <input value={f.favorite_colors || ""} onChange={(e) => change("favorite_colors", e.target.value)} />

          <button className="btn" onClick={save}>Save character</button>
          {message && <p className="success">{message}</p>}
        </div>
      </div>
    </div>
  );
}
