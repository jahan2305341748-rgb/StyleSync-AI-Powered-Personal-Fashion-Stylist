import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api.js";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => { api("/profile").then(setUser); }, []);
  if (!user) return <div className="page">Loading...</div>;

  async function save(e) {
    e.preventDefault();
    const form = new FormData();
    form.append("name", user.name || "");
    form.append("email", user.email || "");
    form.append("phone", user.phone || "");
    if (photo) form.append("photo", photo);
    await api("/profile", "PUT", form);
    setMessage("Profile saved");
  }

  return (
    <div className="page narrow">
      <Link to="/" className="back">Back to lobby</Link>
      <h2>Your profile</h2>
      <form className="panel" onSubmit={save}>
        {user.profile_picture && <img className="avatar" src={user.profile_picture} alt="Profile" />}

        <label>Photo</label>
        <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />

        <label>Name</label>
        <input value={user.name || ""} onChange={(e) => setUser({ ...user, name: e.target.value })} />

        <label>Email</label>
        <input type="email" value={user.email || ""} onChange={(e) => setUser({ ...user, email: e.target.value })} />

        <label>Phone</label>
        <input value={user.phone || ""} onChange={(e) => setUser({ ...user, phone: e.target.value })} />

        <button className="btn">Save profile</button>
        {message && <p className="success">{message}</p>}
      </form>
    </div>
  );
}
