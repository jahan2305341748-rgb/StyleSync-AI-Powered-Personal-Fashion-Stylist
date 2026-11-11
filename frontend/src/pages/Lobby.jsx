import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import Character from "../Character.jsx";

export default function Lobby() {
  const [user, setUser] = useState({});
  const [f, setF] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api("/profile").then(setUser).catch(logout);
    api("/fashion").then(setF);
  }, []);

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="lobby">
      <div className="topbar">
        <span className="logo">StyleSync</span>
        <button className="btn small ghost" onClick={logout}>Log out</button>
      </div>

      {/* Left menu - Module 1 */}
      <div className="menu left">
        <Link to="/fashion" className="menu-item">Character</Link>
        <Link to="/wardrobe" className="menu-item">Wardrobe</Link>
        <Link to="/profile" className="menu-item">Profile</Link>
      </div>

      {/* Center - the character stands on the platform */}
      <div className="stage">
        <div className="player-name">{user.name || user.email}</div>
        {f && <Character bodyType={f.body_type} skin={f.skin_color} top={f.top_color} bottom={f.bottom_color} style={f.style} />}
        <div className="platform"></div>
      </div>

      {/* Right menu - other modules */}
      <div className="menu right">
        <Link to="/soon/Outfit Recommendations" className="menu-item locked">Outfit Recommendations <small>Coming soon</small></Link>
        <Link to="/soon/Weather and Occasion" className="menu-item locked">Weather and Occasion <small>Coming soon</small></Link>
        <Link to="/soon/Saved Outfits and Feedback" className="menu-item locked">Saved Outfits <small>Coming soon</small></Link>
      </div>
    </div>
  );
}
