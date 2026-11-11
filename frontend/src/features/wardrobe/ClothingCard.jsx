// Shows one clothing item with Edit and Delete buttons
export default function ClothingCard({ item, onEdit, onDelete }) {
  return (
    <div className="panel item">
      {item.image_url ? <img src={item.image_url} alt={item.name} /> : <div className="noimg">No photo</div>}
      <h4>{item.name}</h4>
      <p className="muted">{item.type}, {item.color}, {item.season}, {item.occasion}</p>
      <div className="row">
        <button className="btn small" onClick={() => onEdit(item)}>Edit</button>
        <button className="btn small danger" onClick={() => onDelete(item.clothing_id)}>Delete</button>
      </div>
    </div>
  );
}
