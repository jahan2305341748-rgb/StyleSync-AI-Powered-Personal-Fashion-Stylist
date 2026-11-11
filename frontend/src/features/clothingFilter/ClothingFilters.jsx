import { types, seasons, occasions } from "../wardrobe/options.js";

// Search box and filter dropdowns
export default function ClothingFilters({ filters, setFilters }) {
  function change(field, value) {
    setFilters({ ...filters, [field]: value });
  }

  return (
    <div className="row filters">
      <input placeholder="Search by name" onChange={(e) => change("search", e.target.value)} />
      <input placeholder="Color" onChange={(e) => change("color", e.target.value)} />
      <select onChange={(e) => change("type", e.target.value)}>
        <option value="">All types</option>
        {types.map((t) => <option key={t}>{t}</option>)}
      </select>
      <select onChange={(e) => change("season", e.target.value)}>
        <option value="">All seasons</option>
        {seasons.map((s) => <option key={s}>{s}</option>)}
      </select>
      <select onChange={(e) => change("occasion", e.target.value)}>
        <option value="">All occasions</option>
        {occasions.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
