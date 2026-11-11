import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api.js";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const data = await api(isRegister ? "/register" : "/login", "POST", { email, password });
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-page">
      <form className="panel login-box" onSubmit={submit}>
        <h1 className="logo">StyleSync</h1>
        <p className="muted">{isRegister ? "Create your player account" : "Log in to enter the lobby"}</p>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        <button className="btn">{isRegister ? "Sign up" : "Log in"}</button>
        <p className="muted link" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Already have an account? Log in" : "New here? Create an account"}
        </p>
      </form>
    </div>
  );
}
