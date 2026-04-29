import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setVerificationToken("");
    setLoading(true);

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
        setIsError(true);
        setMessage(data.message || "Registration failed");
        return;
      }

      setMessage("Registration successful. Please verify your email.");
      setVerificationToken(data.verificationToken || "");
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
      eyebrow="Get started"
      title="Create your account"
      subtitle="Register with your university email to access the dashboard."
    >
      <form onSubmit={handleRegister} className="auth-form">
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

        <div className="field">
          <label htmlFor="password" className="field-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="input"
            placeholder="At least 8 characters, e.g. Password123"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      {verificationToken && (
        <div className="token-box">
          <strong>Verification token</strong>
          <code>{verificationToken}</code>
          <span>Copy this token and continue to verify your email.</span>
        </div>
      )}

      <div className="auth-meta">
        <span>
          Already have an account? <Link to="/">Sign in</Link>
        </span>
        <span>
          Have a token? <Link to="/verify-email">Verify email</Link>
        </span>
      </div>
    </AuthLayout>
  );
}
