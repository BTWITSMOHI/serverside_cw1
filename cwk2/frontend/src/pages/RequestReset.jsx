import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

export default function RequestReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setResetToken("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5001/api/auth/request-password-reset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setIsError(true);
        setMessage(data.message || "Reset request failed");
        return;
      }

      setMessage("Reset token generated.");
      setResetToken(data.resetToken || "");
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
      title="Reset your password"
      subtitle="Enter your university email and we&apos;ll generate a one-time reset token."
    >
      <form onSubmit={handleRequestReset} className="auth-form">
        <div className="field">
          <label htmlFor="email" className="field-label">
            University email
          </label>
          <input
            id="email"
            type="email"
            className="input"
            placeholder="you@university.ac.uk"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          {loading ? "Generating..." : "Request reset token"}
        </button>
      </form>

      {resetToken && (
        <div className="token-box">
          <strong>Reset token</strong>
          <code>{resetToken}</code>
          <span>Copy this token and continue to reset your password.</span>
        </div>
      )}

      <div className="auth-meta">
        <span>
          Continue to <Link to="/reset-password">Reset password</Link>
        </span>
        <span>
          Back to <Link to="/">Sign in</Link>
        </span>
      </div>
    </AuthLayout>
  );
}
