import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setLoading(true);

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
        setIsError(true);
        setMessage(data.message || "Password reset failed");
        return;
      }

      setMessage(data.message || "Password reset successful");
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Set a new password"
      subtitle="Paste your reset token and choose a new password to regain access."
    >
      <form onSubmit={handleReset} className="auth-form">
        <div className="field">
          <label htmlFor="token" className="field-label">
            Reset token
          </label>
          <input
            id="token"
            type="text"
            className="input"
            placeholder="Paste your reset token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="newPassword" className="field-label">
            New password
          </label>
          <input
            id="newPassword"
            type="password"
            className="input"
            placeholder="e.g. NewPassword123"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        {message && (
          <div className={isError ? "alert alert-error" : "alert alert-success"}>
            {message}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loading}
        >
          {loading ? "Updating..." : "Reset password"}
        </button>
      </form>

      <div className="auth-meta">
        <span>
          Back to <Link to="/">Sign in</Link>
        </span>
      </div>
    </AuthLayout>
  );
}
