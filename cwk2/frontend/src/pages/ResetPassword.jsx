import { useState } from "react";
import { Link } from "react-router-dom";

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5001/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Password reset failed");
        return;
      }

      setMessage(data.message || "Password reset successful");
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "450px", margin: "auto" }}>
      <h2>Reset Password</h2>

      <form onSubmit={handleReset}>
        <input
          type="text"
          placeholder="Paste reset token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="New password e.g. NewPassword123"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#8B5CF6",
            color: "white",
            border: "none",
            borderRadius: "6px"
          }}
        >
          Reset Password
        </button>
      </form>

      {message && <p>{message}</p>}

      <p>
        Back to <Link to="/">Login</Link>
      </p>
    </div>
  );
}