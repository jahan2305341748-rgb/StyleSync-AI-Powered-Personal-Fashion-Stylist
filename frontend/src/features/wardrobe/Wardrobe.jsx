import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api.js";
import ClothingForm from "./ClothingForm.jsx";
import ClothingCard from "./ClothingCard.jsx";
import ClothingFilters from "../clothingFilter/ClothingFilters.jsx";
import { emptyItem } from "./options.js";

export default function Wardrobe() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ search: "", type: "", season: "", occasion: "", color: "" });
  const [form, setForm] = useState(emptyItem);
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Load clothes again whenever a filter changes (feature 4 route)
  function load() {
    api("/wardrobe/search?" + new URLSearchParams(filters)).then(setItems);
  }
  useEffect(load, [filters]);

  async function save(e) {
    e.preventDefault();
    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));
    if (image) data.append("image", image);

    if (editingId) await api("/wardrobe/" + editingId, "PUT", data);
    else await api("/wardrobe", "POST", data);

    setForm(emptyItem);
    setImage(null);
    setEditingId(null);
    e.target.reset();
    load();
  }

  function edit(item) {
    setEditingId(item.clothing_id);
    setForm({ name: item.name, brand: item.brand, type: item.type, color: item.color, season: item.season, occasion: item.occasion });
    window.scrollTo(0, 0);
  }

  async function remove(id) {
    if (!confirm("Delete this item?")) return;
    await api("/wardrobe/" + id, "DELETE");
    load();
  }

  return (
    <div className="page">
      <Link to="/" className="back">Back to lobby</Link>
      <h2>Digital wardrobe</h2>

      <ClothingForm form={form} setForm={setForm} setImage={setImage} editing={editingId} onSubmit={save} />
      <ClothingFilters filters={filters} setFilters={setFilters} />

      {items.length === 0 && <p className="muted">No clothes found. Add your first item above.</p>}
      <div className="grid">
        {items.map((item) => (
          <ClothingCard key={item.clothing_id} item={item} onEdit={edit} onDelete={remove} />
        ))}
      </div>
    </div>
  );
}
