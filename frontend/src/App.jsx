import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./features/auth/Login.jsx";
import Lobby from "./pages/Lobby.jsx";
import Profile from "./features/auth/Profile.jsx";
import Fashion from "./features/fashionProfile/Fashion.jsx";
import Wardrobe from "./features/wardrobe/Wardrobe.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";

// Only logged-in users can open these pages
function Private({ children }) {
  return localStorage.getItem("token") ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Private><Lobby /></Private>} />
      <Route path="/profile" element={<Private><Profile /></Private>} />
      <Route path="/fashion" element={<Private><Fashion /></Private>} />
      <Route path="/wardrobe" element={<Private><Wardrobe /></Private>} />
      <Route path="/soon/:name" element={<Private><ComingSoon /></Private>} />
    </Routes>
  );
}
