import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Secure access"
      title="Welcome back"
      subtitle="Sign in to view live alumni intelligence and reporting."
    >
      <form onSubmit={handleLogin} className="auth-form">
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
          <div className="auth-row">
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <Link to="/request-reset">Forgot password?</Link>
          </div>
          <input
            id="password"
            type="password"
            className="input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="auth-meta">
        <span>
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </span>
        <span>
          Need to verify? <Link to="/verify-email">Verify email</Link>
        </span>
      </div>
    </AuthLayout>
  );
}
