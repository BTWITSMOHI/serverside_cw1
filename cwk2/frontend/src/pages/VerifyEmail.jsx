import { useState } from "react";
import { Link } from "react-router-dom";

export default function VerifyEmail() {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5001/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Verification failed");
        return;
      }

      setMessage(data.message || "Email verified successfully");
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "450px", margin: "auto" }}>
      <h2>Verify Email</h2>

      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="Paste verification token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#10B981",
            color: "white",
            border: "none",
            borderRadius: "6px"
          }}
        >
          Verify Email
        </button>
      </form>

      {message && <p>{message}</p>}

      <p>
        Back to <Link to="/">Login</Link>
      </p>
    </div>
  );
}