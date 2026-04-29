import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

export default function VerifyEmail() {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setLoading(true);

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
        setIsError(true);
        setMessage(data.message || "Verification failed");
        return;
      }

      setMessage(data.message || "Email verified successfully");
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
      eyebrow="Verification"
      title="Verify your email"
      subtitle="Paste the verification token sent to you to activate your account."
    >
      <form onSubmit={handleVerify} className="auth-form">
        <div className="field">
          <label htmlFor="token" className="field-label">
            Verification token
          </label>
          <input
            id="token"
            type="text"
            className="input"
            placeholder="Paste your token here"
            value={token}
            onChange={(e) => setToken(e.target.value)}
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
          className="btn btn-accent btn-block"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify email"}
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
