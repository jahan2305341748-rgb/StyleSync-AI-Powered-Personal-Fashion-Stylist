import { types, seasons, occasions } from "./options.js";

// Form to add a new item or update an existing one
export default function ClothingForm({ form, setForm, setImage, editing, onSubmit }) {
  return (
    <form className="panel row" onSubmit={onSubmit}>
      <input placeholder="Item name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <input placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
      <input placeholder="Color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
      <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
        {types.map((t) => <option key={t}>{t}</option>)}
      </select>
      <select value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })}>
        {seasons.map((s) => <option key={s}>{s}</option>)}
      </select>
      <select value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })}>
        {occasions.map((o) => <option key={o}>{o}</option>)}
      </select>
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
      <button className="btn">{editing ? "Update item" : "Add item"}</button>
    </form>
  );
}
