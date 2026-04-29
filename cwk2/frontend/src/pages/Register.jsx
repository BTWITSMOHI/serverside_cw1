import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [verificationToken, setVerificationToken] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setVerificationToken("");

    try {
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Registration failed");
        return;
      }

      setMessage("Registration successful. Please verify your email.");
      setVerificationToken(data.verificationToken || "");
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "450px", margin: "auto" }}>
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
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
          placeholder="Password e.g. Password123"
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
          Register
        </button>
      </form>

      {message && <p>{message}</p>}

      {verificationToken && (
        <div style={{ marginTop: "15px", padding: "10px", background: "#F3F4F6" }}>
          <p><strong>Verification Token:</strong></p>
          <p style={{ wordBreak: "break-all" }}>{verificationToken}</p>
          <p>Copy this token and verify your email.</p>
        </div>
      )}

      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>

      <p>
        Verify email? <Link to="/verify-email">Go to verification</Link>
      </p>
    </div>
  );
}