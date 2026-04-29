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
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Loading Dashboard...</h2>
        <p>Please wait while analytics data is loaded.</p>
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
        backgroundColor: "#3B82F6",
      },
    ],
  };

  const programmeOptions = {
    responsive: true,
    animation: { duration: 1000 },
    plugins: { legend: { display: true } },
    scales: {
      x: { title: { display: true, text: "Programme" } },
      y: {
        title: { display: true, text: "Number of Alumni" },
        beginAtZero: true,
      },
    },
  };

  const industryChart = {
    labels: filteredIndustries.map((item) => item.industry_sector || "Unknown"),
    datasets: [
      {
        label: "Industry Sector",
        data: filteredIndustries.map((item) => Number(item.count)),
        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
          "#06B6D4",
          "#F97316",
          "#EC4899",
        ],
      },
    ],
  };

  const jobChart = {
    labels: jobs.map((item) => item.job_title || "Unknown"),
    datasets: [
      {
        label: "Job Titles",
        data: jobs.map((item) => Number(item.count)),
        backgroundColor: [
          "#10B981",
          "#3B82F6",
          "#F59E0B",
          "#8B5CF6",
          "#EC4899",
          "#6B7280",
          "#06B6D4",
        ],
      },
    ],
  };

  const employerChart = {
    labels: employers.map((item) => item.employer || "Unknown"),
    datasets: [
      {
        label: "Alumni Count",
        data: employers.map((item) => Number(item.count)),
        backgroundColor: "#F97316",
      },
    ],
  };

  const employerOptions = {
    responsive: true,
    animation: { duration: 1000 },
    plugins: { legend: { display: true } },
    scales: {
      x: { title: { display: true, text: "Employer" } },
      y: {
        title: { display: true, text: "Number of Alumni" },
        beginAtZero: true,
      },
    },
  };

  const certificationChart = {
    labels: certifications.map((c) => c.name || "Unknown"),
    datasets: [
      {
        label: "Certifications",
        data: certifications.map((c) => Number(c.count)),
        backgroundColor: certifications.map((c) => {
          const value = Number(c.count);
          if (value >= 3) return "#EF4444";
          if (value === 2) return "#F59E0B";
          return "#10B981";
        }),
      },
    ],
  };

  const certificationOptions = {
    responsive: true,
    animation: { duration: 1000 },
    plugins: {
      legend: { display: true },
      tooltip: {
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
    scales: {
      x: { title: { display: true, text: "Certification" } },
      y: {
        title: { display: true, text: "Number of Alumni" },
        beginAtZero: true,
      },
    },
  };

  const trendChart = {
    labels: filteredTrends.map((t) => t.graduation_year || "Unknown"),
    datasets: [
      {
        label: "Graduates",
        data: filteredTrends.map((t) => Number(t.count)),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const trendOptions = {
    responsive: true,
    animation: { duration: 1000 },
    plugins: { legend: { display: true } },
    scales: {
      x: { title: { display: true, text: "Graduation Year" } },
      y: {
        title: { display: true, text: "Number of Alumni" },
        beginAtZero: true,
      },
    },
  };

  const radarChart = {
    labels: radar.map((r) => r.label),
    datasets: [
      {
        label: "System Data Overview",
        data: radar.map((r) => Number(r.value)),
        backgroundColor: "rgba(139, 92, 246, 0.2)",
        borderColor: "#8B5CF6",
      },
    ],
  };

  const usageChart = {
    labels: usage.map((u) => u.endpoint || "Unknown"),
    datasets: [
      {
        label: "API Calls",
        data: usage.map((u) => Number(u.count)),
        backgroundColor: "#EF4444",
      },
    ],
  };

  const usageOptions = {
    responsive: true,
    animation: { duration: 1000 },
    plugins: { legend: { display: true } },
    scales: {
      x: { title: { display: true, text: "Endpoint" } },
      y: {
        title: { display: true, text: "Number of Calls" },
        beginAtZero: true,
      },
    },
  };

  const buttonStyle = {
    padding: "10px 16px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  };

  const pngButtonStyle = {
    marginTop: "12px",
    padding: "8px 12px",
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  };

  const navStyle = {
    padding: "10px 14px",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#111827",
    background: "#E5E7EB",
    fontWeight: "600",
  };

  const activeNavStyle = {
    ...navStyle,
    background: "#3B82F6",
    color: "white",
  };

  return (
    <div className="dashboard">
      <header
        className="dashboard-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
        }}
      >
        <div>
          <h1>Alumni Intelligence Dashboard</h1>
          <p>
            Alumni intelligence dashboard showing graduate outcomes, industries,
            job roles, certifications, programme trends, and API usage
            statistics.
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            ...buttonStyle,
            background: "#EF4444",
          }}
        >
          Logout
        </button>
      </header>

      <nav
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <Link to="/dashboard" style={view === "overview" ? activeNavStyle : navStyle}>
          Overview
        </Link>
        <Link to="/programme" style={view === "programme" ? activeNavStyle : navStyle}>
          By Programme
        </Link>
        <Link to="/graduation" style={view === "graduation" ? activeNavStyle : navStyle}>
          By Graduation Year
        </Link>
        <Link to="/industry" style={view === "industry" ? activeNavStyle : navStyle}>
          By Industry
        </Link>
        <Link to="/usage" style={view === "usage" ? activeNavStyle : navStyle}>
          API Usage
        </Link>
      </nav>

      {error && (
        <p style={{ color: "#B91C1C", marginBottom: "12px" }}>{error}</p>
      )}

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => downloadCSV(exportRows, "filtered-dashboard-data.csv")}
          style={{
            ...buttonStyle,
            background: "#3B82F6",
          }}
        >
          Export Filtered Data (CSV)
        </button>

        <button
          onClick={exportDashboardPDF}
          style={{
            ...buttonStyle,
            background: "#10B981",
          }}
        >
          Export Dashboard PDF
        </button>

        <select
          value={selectedProgramme}
          onChange={(e) => setSelectedProgramme(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #D1D5DB",
          }}
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
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #D1D5DB",
          }}
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
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #D1D5DB",
          }}
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
          style={{
            ...buttonStyle,
            background: "#6B7280",
          }}
        >
          Reset Filters
        </button>

        <button
          onClick={savePreset}
          style={{
            ...buttonStyle,
            background: "#8B5CF6",
          }}
        >
          Save Filter Preset
        </button>
      </div>

      {savedFilters.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <strong>Saved Presets: </strong>
          {savedFilters.map((preset, index) => (
            <button
              key={index}
              onClick={() => applyPreset(preset)}
              style={{
                marginLeft: "8px",
                marginTop: "6px",
                padding: "8px 12px",
                background: "#E5E7EB",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Preset {index + 1}
            </button>
          ))}
        </div>
      )}

      {view === "overview" && (
        <>
          <section className="cards">
            <div className="card">
              <h3>Total Alumni</h3>
              <p>{summary?.total_alumni || 0}</p>
            </div>

            <div className="card">
              <h3>Currently Employed</h3>
              <p>{summary?.employed || 0}</p>
            </div>

            <div className="card">
              <h3>Programmes Tracked</h3>
              <p>{programmes.length}</p>
            </div>

            <div className="card">
              <h3>Top Employers</h3>
              <p>{employers.length}</p>
            </div>

            <div className="card">
              <h3>API Endpoints Tracked</h3>
              <p>{usage.length}</p>
            </div>
          </section>

          <h2 style={{ marginBottom: "10px" }}>Overview</h2>

          <section className="charts-grid">
            <div className="chart-card">
              <h2>Top Certifications / Skills Gap</h2>
              <p>
                Colour coding highlights emerging, significant, and critical
                skills gaps based on certification demand.
              </p>
              <Bar
                id="certificationChart"
                data={certificationChart}
                options={certificationOptions}
              />
              <button
                style={pngButtonStyle}
                onClick={() =>
                  downloadChart("certificationChart", "certification-skills-gap")
                }
              >
                Download PNG
              </button>
            </div>

            <div className="chart-card">
              <h2>Most Common Job Titles</h2>
              <p>Highlights emerging graduate career pathways.</p>
              <Doughnut id="jobChart" data={jobChart} />
              <button
                style={pngButtonStyle}
                onClick={() => downloadChart("jobChart", "job-titles")}
              >
                Download PNG
              </button>
            </div>

            <div className="chart-card">
              <h2>Top Employers</h2>
              <p>Shows employers hiring the most alumni.</p>
              <Bar id="employerChart" data={employerChart} options={employerOptions} />
              <button
                style={pngButtonStyle}
                onClick={() => downloadChart("employerChart", "top-employers")}
              >
                Download PNG
              </button>
            </div>

            <div className="chart-card">
              <h2>System Overview Radar</h2>
              <p>Compares major data categories stored in the system.</p>
              <Radar id="radarChart" data={radarChart} />
              <button
                style={pngButtonStyle}
                onClick={() => downloadChart("radarChart", "system-radar")}
              >
                Download PNG
              </button>
            </div>
          </section>
        </>
      )}

      {view === "programme" && (
        <>
          <h2>Alumni by Programme</h2>
          <p>
            This page allows the university to compare alumni outcomes across
            different academic programmes.
          </p>

          <section className="charts-grid">
            <div className="chart-card">
              <h2>Programme Distribution</h2>
              <Bar
                id="programmeChart"
                data={programmeChart}
                options={programmeOptions}
              />
              <button
                style={pngButtonStyle}
                onClick={() => downloadChart("programmeChart", "programme-chart")}
              >
                Download PNG
              </button>
            </div>

            <div className="chart-card">
              <h2>Programme Insight</h2>
              <p>
                This chart can help identify which programmes have the strongest
                graduate tracking data and where further alumni engagement may
                be required.
              </p>
            </div>
          </section>
        </>
      )}

      {view === "graduation" && (
        <>
          <h2>Alumni by Graduation Year</h2>
          <p>
            This page shows graduate tracking trends across different graduation
            cohorts.
          </p>

          <section className="charts-grid">
            <div className="chart-card">
              <h2>Graduation Trends</h2>
              <Line id="trendChart" data={trendChart} options={trendOptions} />
              <button
                style={pngButtonStyle}
                onClick={() => downloadChart("trendChart", "graduation-trends")}
              >
                Download PNG
              </button>
            </div>

            <div className="chart-card">
              <h2>Graduation Year Insight</h2>
              <p>
                Year-based trends help the university understand how recent and
                older cohorts are represented in the alumni dataset.
              </p>
            </div>
          </section>
        </>
      )}

      {view === "industry" && (
        <>
          <h2>Alumni by Industry Sector</h2>
          <p>
            This page shows the industries where alumni are currently employed.
          </p>

          <section className="charts-grid">
            <div className="chart-card">
              <h2>Employment by Industry Sector</h2>
              <Pie id="industryChart" data={industryChart} />
              <button
                style={pngButtonStyle}
                onClick={() => downloadChart("industryChart", "industry-sector")}
              >
                Download PNG
              </button>
            </div>

            <div className="chart-card">
              <h2>Industry Insight</h2>
              <p>
                Industry analysis helps the university identify graduate
                destination patterns and emerging employment sectors.
              </p>
            </div>
          </section>
        </>
      )}

      {view === "usage" && (
        <>
          <h2>API Usage Statistics</h2>
          <p>
            This page shows how often dashboard API endpoints are accessed,
            supporting monitoring and security analysis.
          </p>

          <section className="charts-grid">
            <div className="chart-card">
              <h2>Endpoint Usage</h2>
              <Bar id="usageChart" data={usageChart} options={usageOptions} />
              <button
                style={pngButtonStyle}
                onClick={() => downloadChart("usageChart", "api-usage")}
              >
                Download PNG
              </button>
            </div>

            <div className="chart-card">
              <h2>Usage Insight</h2>
              <p>
                API usage statistics help monitor client activity, endpoint
                popularity, and API key-based access patterns.
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}