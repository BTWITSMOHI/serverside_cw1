import { useState } from "react";
import { Link } from "react-router-dom";

export default function RequestReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetToken, setResetToken] = useState("");

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setResetToken("");

    try {
      const res = await fetch("http://localhost:5001/api/auth/request-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Reset request failed");
        return;
      }

      setMessage("Reset token generated.");
      setResetToken(data.resetToken || "");
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "450px", margin: "auto" }}>
      <h2>Request Password Reset</h2>

      <form onSubmit={handleRequestReset}>
        <input
          type="email"
          placeholder="University email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#F59E0B",
            color: "white",
            border: "none",
            borderRadius: "6px"
          }}
        >
          Request Reset
        </button>
      </form>

      {message && <p>{message}</p>}

      {resetToken && (
        <div style={{ marginTop: "15px", padding: "10px", background: "#F3F4F6" }}>
          <p><strong>Reset Token:</strong></p>
          <p style={{ wordBreak: "break-all" }}>{resetToken}</p>
          <p>Copy this token and continue to reset password.</p>
        </div>
      )}

      <p>
        Continue to <Link to="/reset-password">Reset Password</Link>
      </p>

      <p>
        Back to <Link to="/">Login</Link>
      </p>
    </div>
  );
}