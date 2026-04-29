import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchData } from "../api";
import { downloadCSV } from "../utils/exportCSV";
import { exportDashboardPDF } from "../utils/exportPDF";

import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie, Doughnut, Line, Radar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

/* Brand-aligned chart palette (indigo + neutrals + emerald) */
const PALETTE = {
  primary: "#4f46e5",
  primarySoft: "rgba(79, 70, 229, 0.15)",
  accent: "#059669",
  warning: "#d97706",
  danger: "#e11d48",
  slate: "#64748b",
  multi: [
    "#4f46e5",
    "#059669",
    "#d97706",
    "#e11d48",
    "#0ea5e9",
    "#7c3aed",
    "#f97316",
    "#14b8a6",
  ],
};

const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 800 },
  plugins: {
    legend: {
      labels: {
        color: "#475569",
        font: { family: "Inter, sans-serif", size: 12 },
        boxWidth: 12,
        boxHeight: 12,
        padding: 12,
      },
    },
    tooltip: {
      backgroundColor: "#0f172a",
      titleFont: { family: "Inter, sans-serif", weight: "600" },
      bodyFont: { family: "Inter, sans-serif" },
      padding: 10,
      cornerRadius: 6,
    },
  },
};

const cartesianScales = (xTitle, yTitle) => ({
  x: {
    title: { display: true, text: xTitle, color: "#64748b" },
    grid: { color: "#f1f5f9" },
    ticks: { color: "#64748b", font: { size: 11 } },
  },
  y: {
    title: { display: true, text: yTitle, color: "#64748b" },
    beginAtZero: true,
    grid: { color: "#f1f5f9" },
    ticks: { color: "#64748b", font: { size: 11 } },
  },
});

function downloadChart(chartId, fileName) {
  const canvas = document.getElementById(chartId);

  if (!canvas) {
    alert("Chart not found");
    return;
  }

  const link = document.createElement("a");
  link.download = `${fileName}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

/* Tiny inline icon helpers */
const Icon = ({ d, ...props }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    {d}
  </svg>
);

const navItems = [
  {
    to: "/dashboard",
    key: "overview",
    label: "Overview",
    icon: (
      <Icon
        d={
          <>
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </>
        }
      />
    ),
  },
  {
    to: "/programme",
    key: "programme",
    label: "By Programme",
    icon: (
      <Icon
        d={
          <>
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 1.66 4 3 6 3s6-1.34 6-3v-5" />
          </>
        }
      />
    ),
  },
  {
    to: "/graduation",
    key: "graduation",
    label: "By Graduation Year",
    icon: (
      <Icon
        d={
          <>
            <path d="M3 3v18h18" />
            <path d="M7 14l4-4 4 4 5-6" />
          </>
        }
      />
    ),
  },
  {
    to: "/industry",
    key: "industry",
    label: "By Industry",
    icon: (
      <Icon
        d={
          <>
            <path d="M3 21V8l9-5 9 5v13" />
            <path d="M9 21v-6h6v6" />
          </>
        }
      />
    ),
  },
  {
    to: "/usage",
    key: "usage",
    label: "API Usage",
    icon: (
      <Icon
        d={
          <>
            <path d="M12 20v-6" />
            <path d="M6 20V10" />
            <path d="M18 20V4" />
          </>
        }
      />
    ),
  },
];

const viewMeta = {
  overview: {
    title: "Overview",
    subtitle:
      "Top-level alumni intelligence: graduate outcomes, industries, employers, certifications, programme trends, and API usage.",
  },
  programme: {
    title: "Alumni by Programme",
    subtitle:
      "Compare alumni outcomes across academic programmes to identify engagement and tracking opportunities.",
  },
  graduation: {
    title: "Alumni by Graduation Year",
    subtitle:
      "Cohort trends across graduation years to understand recent and historical alumni representation.",
  },
  industry: {
    title: "Alumni by Industry Sector",
    subtitle:
      "Industries where alumni are currently employed to spot emerging destination sectors.",
  },
  usage: {
    title: "API Usage Statistics",
    subtitle:
      "Monitor endpoint activity and API key access patterns for monitoring and security analysis.",
  },
};

export default function Dashboard({ view = "overview" }) {
  const [summary, setSummary] = useState(null);
  const [programmes, setProgrammes] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [trends, setTrends] = useState([]);
  const [radar, setRadar] = useState([]);
  const [usage, setUsage] = useState([]);

  const [selectedProgramme, setSelectedProgramme] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [savedFilters, setSavedFilters] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  function savePreset() {
    const preset = {
      programme: selectedProgramme,
      year: selectedYear,
      industry: selectedIndustry,
    };

    setSavedFilters((prev) => [...prev, preset]);
  }

  function applyPreset(preset) {
    setSelectedProgramme(preset.programme);
    setSelectedYear(preset.year);
    setSelectedIndustry(preset.industry);
  }

  useEffect(() => {
    async function loadDashboard() {
      setError("");

      try {
        const results = await Promise.allSettled([
          fetchData("/api/analytics/summary"),
          fetchData("/api/analytics/programme"),
          fetchData("/api/analytics/industry"),
          fetchData("/api/analytics/jobs"),
          fetchData("/api/analytics/employers"),
          fetchData("/api/analytics/certifications"),
          fetchData("/api/analytics/graduation-trends"),
          fetchData("/api/analytics/radar-skills"),
          fetchData("/api/analytics/usage"),
        ]);

        if (results[0].status === "fulfilled") setSummary(results[0].value);
        if (results[1].status === "fulfilled") setProgrammes(results[1].value);
        if (results[2].status === "fulfilled") setIndustries(results[2].value);
        if (results[3].status === "fulfilled") setJobs(results[3].value);
        if (results[4].status === "fulfilled") setEmployers(results[4].value);
        if (results[5].status === "fulfilled")
          setCertifications(results[5].value);
        if (results[6].status === "fulfilled") setTrends(results[6].value);
        if (results[7].status === "fulfilled") setRadar(results[7].value);
        if (results[8].status === "fulfilled") setUsage(results[8].value);

        const failed = results.some((r) => r.status === "rejected");
        if (failed) {
          setError("Some data may be missing, but dashboard is still usable.");
        }
      } catch (err) {
        console.error("Dashboard loading error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="loading-shell">
        <div className="spinner" aria-hidden="true" />
        <h2 style={{ fontSize: 18 }}>Loading dashboard</h2>
        <p className="muted">Fetching analytics data, please wait&hellip;</p>
      </div>
    );
  }

  const years = [...new Set(trends.map((item) => item.graduation_year))].filter(
    Boolean
  );

  const filteredProgrammes = selectedProgramme
    ? programmes.filter((item) => item.programme === selectedProgramme)
    : programmes;

  const filteredTrends = selectedYear
    ? trends.filter((item) => String(item.graduation_year) === selectedYear)
    : trends;

  const filteredIndustries = selectedIndustry
    ? industries.filter((item) => item.industry_sector === selectedIndustry)
    : industries;

  const exportRows = [
    ...filteredProgrammes.map((item) => ({
      type: "Programme",
      name: item.programme || "Unknown",
      count: item.count,
    })),
    ...filteredTrends.map((item) => ({
      type: "Graduation Year",
      name: item.graduation_year || "Unknown",
      count: item.count,
    })),
    ...filteredIndustries.map((item) => ({
      type: "Industry Sector",
      name: item.industry_sector || "Unknown",
      count: item.count,
    })),
  ];

  const programmeChart = {
    labels: filteredProgrammes.map((item) => item.programme || "Unknown"),
    datasets: [
      {
        label: "Number of Alumni",
        data: filteredProgrammes.map((item) => Number(item.count)),
        backgroundColor: PALETTE.primary,
        borderRadius: 6,
        maxBarThickness: 36,
      },
    ],
  };

  const programmeOptions = {
    ...baseChartOptions,
    scales: cartesianScales("Programme", "Number of Alumni"),
  };

  const industryChart = {
    labels: filteredIndustries.map((item) => item.industry_sector || "Unknown"),
    datasets: [
      {
        label: "Industry Sector",
        data: filteredIndustries.map((item) => Number(item.count)),
        backgroundColor: PALETTE.multi,
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const jobChart = {
    labels: jobs.map((item) => item.job_title || "Unknown"),
    datasets: [
      {
        label: "Job Titles",
        data: jobs.map((item) => Number(item.count)),
        backgroundColor: PALETTE.multi,
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const employerChart = {
    labels: employers.map((item) => item.employer || "Unknown"),
    datasets: [
      {
        label: "Alumni Count",
        data: employers.map((item) => Number(item.count)),
        backgroundColor: PALETTE.warning,
        borderRadius: 6,
        maxBarThickness: 36,
      },
    ],
  };

  const employerOptions = {
    ...baseChartOptions,
    scales: cartesianScales("Employer", "Number of Alumni"),
  };

  const certificationChart = {
    labels: certifications.map((c) => c.name || "Unknown"),
    datasets: [
      {
        label: "Certifications",
        data: certifications.map((c) => Number(c.count)),
        backgroundColor: certifications.map((c) => {
          const value = Number(c.count);
          if (value >= 3) return PALETTE.danger;
          if (value === 2) return PALETTE.warning;
          return PALETTE.accent;
        }),
        borderRadius: 6,
        maxBarThickness: 36,
      },
    ],
  };

  const certificationOptions = {
    ...baseChartOptions,
    plugins: {
      ...baseChartOptions.plugins,
      tooltip: {
        ...baseChartOptions.plugins.tooltip,
        callbacks: {
          label: function (context) {
            const value = context.parsed.y;
            let level = "Emerging";
            if (value >= 3) level = "Critical gap";
            else if (value === 2) level = "Significant gap";
            return `${value} alumni (${level})`;
          },
        },
      },
    },
    scales: cartesianScales("Certification", "Number of Alumni"),
  };

  const trendChart = {
    labels: filteredTrends.map((t) => t.graduation_year || "Unknown"),
    datasets: [
      {
        label: "Graduates",
        data: filteredTrends.map((t) => Number(t.count)),
        borderColor: PALETTE.primary,
        backgroundColor: PALETTE.primarySoft,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: PALETTE.primary,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
      },
    ],
  };

  const trendOptions = {
    ...baseChartOptions,
    scales: cartesianScales("Graduation Year", "Number of Alumni"),
  };

  const radarChart = {
    labels: radar.map((r) => r.label),
    datasets: [
      {
        label: "System Data Overview",
        data: radar.map((r) => Number(r.value)),
        backgroundColor: PALETTE.primarySoft,
        borderColor: PALETTE.primary,
        borderWidth: 2,
        pointBackgroundColor: PALETTE.primary,
      },
    ],
  };

  const radarOptions = {
    ...baseChartOptions,
    scales: {
      r: {
        angleLines: { color: "#e2e8f0" },
        grid: { color: "#e2e8f0" },
        pointLabels: { color: "#475569", font: { size: 11 } },
        ticks: { color: "#94a3b8", backdropColor: "transparent" },
      },
    },
  };

  const usageChart = {
    labels: usage.map((u) => u.endpoint || "Unknown"),
    datasets: [
      {
        label: "API Calls",
        data: usage.map((u) => Number(u.count)),
        backgroundColor: PALETTE.danger,
        borderRadius: 6,
        maxBarThickness: 36,
      },
    ],
  };

  const usageOptions = {
    ...baseChartOptions,
    scales: cartesianScales("Endpoint", "Number of Calls"),
  };

  const meta = viewMeta[view] || viewMeta.overview;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-brand-mark">AI</span>
          <span>Alumni Intelligence</span>
        </div>

        <nav className="sidebar-section" aria-label="Primary">
          <span className="sidebar-section-label">Analytics</span>
          <div className="sidebar-nav-list" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                className={`nav-link ${view === item.key ? "is-active" : ""}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-ghost btn-block"
          >
            <Icon
              d={
                <>
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </>
              }
            />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <main className="main dashboard">
        <header className="page-header">
          <div>
            <h1>{meta.title}</h1>
            <p className="page-subtitle">{meta.subtitle}</p>
          </div>
        </header>

        {error && (
          <div className="alert alert-info" style={{ marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div className="toolbar">
          <div className="toolbar-group">
            <button
              onClick={() =>
                downloadCSV(exportRows, "filtered-dashboard-data.csv")
              }
              className="btn btn-primary btn-sm"
            >
              <Icon
                d={
                  <>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </>
                }
              />
              Export CSV
            </button>

            <button
              onClick={exportDashboardPDF}
              className="btn btn-accent btn-sm"
            >
              <Icon
                d={
                  <>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </>
                }
              />
              Export PDF
            </button>
          </div>

          <div className="toolbar-divider" />

          <div className="toolbar-group">
            <select
              value={selectedProgramme}
              onChange={(e) => setSelectedProgramme(e.target.value)}
              className="select"
              aria-label="Filter by programme"
            >
              <option value="">All Programmes</option>
              {programmes.map((p, index) => (
                <option key={index} value={p.programme}>
                  {p.programme || "Unknown"}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="select"
              aria-label="Filter by graduation year"
            >
              <option value="">All Graduation Years</option>
              {years.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="select"
              aria-label="Filter by industry"
            >
              <option value="">All Industry Sectors</option>
              {industries.map((industry, index) => (
                <option key={index} value={industry.industry_sector}>
                  {industry.industry_sector || "Unknown"}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setSelectedProgramme("");
                setSelectedYear("");
                setSelectedIndustry("");
              }}
              className="btn btn-outline btn-sm"
            >
              Reset
            </button>

            <button onClick={savePreset} className="btn btn-ghost btn-sm">
              Save preset
            </button>
          </div>
        </div>

        {savedFilters.length > 0 && (
          <div className="preset-row">
            <span style={{ fontWeight: 500, color: "var(--muted-strong)" }}>
              Saved presets:
            </span>
            {savedFilters.map((preset, index) => (
              <button
                key={index}
                onClick={() => applyPreset(preset)}
                className="preset-chip"
              >
                Preset {index + 1}
              </button>
            ))}
          </div>
        )}

        {view === "overview" && (
          <>
            <section className="kpi-grid">
              <KpiCard
                label="Total Alumni"
                value={summary?.total_alumni || 0}
                icon={
                  <Icon
                    d={
                      <>
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </>
                    }
                  />
                }
              />
              <KpiCard
                label="Currently Employed"
                value={summary?.employed || 0}
                icon={
                  <Icon
                    d={
                      <>
                        <rect x="2" y="7" width="20" height="14" rx="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </>
                    }
                  />
                }
              />
              <KpiCard
                label="Programmes Tracked"
                value={programmes.length}
                icon={
                  <Icon
                    d={
                      <>
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c0 1.66 4 3 6 3s6-1.34 6-3v-5" />
                      </>
                    }
                  />
                }
              />
              <KpiCard
                label="Top Employers"
                value={employers.length}
                icon={
                  <Icon
                    d={
                      <>
                        <path d="M3 21V8l9-5 9 5v13" />
                        <path d="M9 21v-6h6v6" />
                      </>
                    }
                  />
                }
              />
              <KpiCard
                label="API Endpoints"
                value={usage.length}
                icon={
                  <Icon
                    d={
                      <>
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2 12 8 18" />
                      </>
                    }
                  />
                }
              />
            </section>

            <h2 className="page-section-title">Insights</h2>

            <section className="charts-grid">
              <ChartCard
                title="Top Certifications / Skills Gap"
                subtitle="Colour coding highlights emerging, significant, and critical skills gaps based on certification demand."
                onDownload={() =>
                  downloadChart("certificationChart", "certification-skills-gap")
                }
              >
                <Bar
                  id="certificationChart"
                  data={certificationChart}
                  options={certificationOptions}
                />
              </ChartCard>

              <ChartCard
                title="Most Common Job Titles"
                subtitle="Highlights emerging graduate career pathways."
                onDownload={() => downloadChart("jobChart", "job-titles")}
              >
                <Doughnut
                  id="jobChart"
                  data={jobChart}
                  options={baseChartOptions}
                />
              </ChartCard>

              <ChartCard
                title="Alumni by Programme"
                subtitle="Distribution across academic programmes."
                onDownload={() =>
                  downloadChart("overviewProgrammeChart", "overview-programme-chart")
                }
              >
                <Bar
                  id="overviewProgrammeChart"
                  data={programmeChart}
                  options={programmeOptions}
                />
              </ChartCard>

              <ChartCard
                title="Graduation Trends"
                subtitle="Distribution by graduation year."
                onDownload={() =>
                  downloadChart("overviewTrendChart", "overview-graduation-trends")
                }
              >
                <Line
                  id="overviewTrendChart"
                  data={trendChart}
                  options={trendOptions}
                />
              </ChartCard>

              <ChartCard
                title="Top Employers"
                subtitle="Employers hiring the most alumni."
                onDownload={() => downloadChart("employerChart", "top-employers")}
              >
                <Bar
                  id="employerChart"
                  data={employerChart}
                  options={employerOptions}
                />
              </ChartCard>

              <ChartCard
                title="System Overview Radar"
                subtitle="Compares major data categories stored in the system."
                onDownload={() => downloadChart("radarChart", "system-radar")}
              >
                <Radar id="radarChart" data={radarChart} options={radarOptions} />
              </ChartCard>
            </section>
          </>
        )}

        {view === "programme" && (
          <section className="charts-grid">
            <ChartCard
              title="Programme Distribution"
              subtitle="Alumni counts per academic programme."
              onDownload={() => downloadChart("programmeChart", "programme-chart")}
            >
              <Bar
                id="programmeChart"
                data={programmeChart}
                options={programmeOptions}
              />
            </ChartCard>

            <div className="insight-card">
              <h3>Programme insight</h3>
              <p>
                This view helps identify which programmes have the strongest
                graduate tracking data and where further alumni engagement may
                be required.
              </p>
            </div>
          </section>
        )}

        {view === "graduation" && (
          <section className="charts-grid">
            <ChartCard
              title="Graduation Trends"
              subtitle="Cohort sizes across graduation years."
              onDownload={() => downloadChart("trendChart", "graduation-trends")}
            >
              <Line id="trendChart" data={trendChart} options={trendOptions} />
            </ChartCard>

            <div className="insight-card">
              <h3>Graduation year insight</h3>
              <p>
                Year-based trends help the university understand how recent and
                older cohorts are represented in the alumni dataset.
              </p>
            </div>
          </section>
        )}

        {view === "industry" && (
          <section className="charts-grid">
            <ChartCard
              title="Employment by Industry Sector"
              subtitle="Where alumni are currently employed."
              onDownload={() => downloadChart("industryChart", "industry-sector")}
            >
              <Pie
                id="industryChart"
                data={industryChart}
                options={baseChartOptions}
              />
            </ChartCard>

            <div className="insight-card">
              <h3>Industry insight</h3>
              <p>
                Industry analysis helps the university identify graduate
                destination patterns and emerging employment sectors.
              </p>
            </div>
          </section>
        )}

        {view === "usage" && (
          <section className="charts-grid">
            <ChartCard
              title="Endpoint Usage"
              subtitle="API calls grouped by endpoint."
              onDownload={() => downloadChart("usageChart", "api-usage")}
            >
              <Bar id="usageChart" data={usageChart} options={usageOptions} />
            </ChartCard>

            <div className="insight-card">
              <h3>Usage insight</h3>
              <p>
                API usage statistics help monitor client activity, endpoint
                popularity, and API key-based access patterns.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function KpiCard({ label, value, icon }) {
  return (
    <div className="kpi-card">
      <div className="kpi-card-header">
        <span className="kpi-label">{label}</span>
        <span className="kpi-icon">{icon}</span>
      </div>
      <div className="kpi-value">{value}</div>
    </div>
  );
}

function ChartCard({ title, subtitle, onDownload, children }) {
  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div>
          <h3>{title}</h3>
          {subtitle && <p className="chart-card-subtitle">{subtitle}</p>}
        </div>
      </div>
      <div className="chart-canvas-wrap">{children}</div>
      {onDownload && (
        <div className="chart-card-footer">
          <button onClick={onDownload} className="btn btn-outline btn-sm">
            <Icon
              d={
                <>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </>
              }
            />
            Download PNG
          </button>
        </div>
      )}
    </div>
  );
}
