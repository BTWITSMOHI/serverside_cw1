import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "450px", margin: "auto" }}>
      <h2>Dashboard Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="University email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#3B82F6",
            color: "white",
            border: "none",
            borderRadius: "6px"
          }}
        >
          Login
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        No account? <Link to="/register">Register</Link>
      </p>

      <p>
        Verify email? <Link to="/verify-email">Verify Email</Link>
      </p>

      <p>
        Forgot password? <Link to="/request-reset">Reset Password</Link>
      </p>
    </div>
  );
}