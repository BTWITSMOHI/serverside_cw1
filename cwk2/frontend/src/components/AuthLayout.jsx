export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <div className="auth-brand">
          <span className="auth-brand-mark" aria-hidden="true">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 1.66 4 3 6 3s6-1.34 6-3v-5" />
            </svg>
          </span>
          <span>Alumni Intelligence</span>
        </div>

        <div className="auth-aside-content">
          <span className="auth-aside-eyebrow">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            Real-time graduate analytics
          </span>
          <h2>Track graduate outcomes with confidence</h2>
          <p>
            A unified dashboard for university teams &mdash; explore programmes,
            graduation cohorts, employers, certifications and API usage in one
            place.
          </p>
        </div>

        <div className="auth-stats">
          <div className="auth-stat">
            <div className="auth-stat-value">12k+</div>
            <div className="auth-stat-label">Alumni tracked</div>
          </div>
          <div className="auth-stat">
            <div className="auth-stat-value">320</div>
            <div className="auth-stat-label">Employers</div>
          </div>
          <div className="auth-stat">
            <div className="auth-stat-value">98%</div>
            <div className="auth-stat-label">Uptime</div>
          </div>
        </div>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-card-header">
            {eyebrow && <span className="auth-card-eyebrow">{eyebrow}</span>}
            <h1>{title}</h1>
            {subtitle && <p className="auth-card-subtitle">{subtitle}</p>}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
