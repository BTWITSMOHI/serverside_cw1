import { useEffect, useState } from "react";
import { fetchData } from "../api";
import { downloadCSV } from "../utils/exportCSV";

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

export default function Dashboard() {
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
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
        if (results[5].status === "fulfilled") setCertifications(results[5].value);
        if (results[6].status === "fulfilled") setTrends(results[6].value);
        if (results[7].status === "fulfilled") setRadar(results[7].value);
        if (results[8].status === "fulfilled") setUsage(results[8].value);
  
        results.forEach((result, index) => {
          if (result.status === "rejected") {
            console.error(`API request ${index} failed:`, result.reason);
          }
        });
      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setLoading(false);
      }
    }
  
    loadDashboard();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
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
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Programme",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Alumni",
        },
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

  const certificationChart = {
    labels: certifications.map((c) => c.name || "Unknown"),
    datasets: [
      {
        label: "Certifications",
        data: certifications.map((c) => Number(c.count)),
        backgroundColor: certifications.map(c =>
          Number(c.count) > 2 ? "#EF4444" : "#10B981"
        ),
      },
    ],
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

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>University Analytics Dashboard</h1>
        <p>
          Alumni intelligence dashboard showing graduate outcomes, industries,
          job roles, certifications, programme trends, and API usage statistics.
        </p>
      </header>

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
            padding: "10px 16px",
            background: "#3B82F6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Export Filtered Data (CSV)
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
            padding: "10px 16px",
            background: "#6B7280",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Reset Filters
        </button>
      </div>

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

      <section className="charts-grid">
        <div className="chart-card">
          <h2>Alumni by Programme</h2>
          <Bar data={programmeChart} options={programmeOptions} />
        </div>

        <div className="chart-card">
          <h2>Employment by Industry Sector</h2>
          <Pie data={industryChart} />
        </div>

        <div className="chart-card">
          <h2>Most Common Job Titles</h2>
          <Doughnut data={jobChart} />
        </div>

        <div className="chart-card">
          <h2>Top Employers</h2>
          <Bar data={employerChart} />
        </div>

        <div className="chart-card">
          <h2>Top Certifications / Skills Gap</h2>
          <Bar data={certificationChart} />
        </div>

        <div className="chart-card">
          <h2>Graduation Trends</h2>
          <Line data={trendChart} />
        </div>

        <div className="chart-card">
          <h2>System Overview Radar</h2>
          <Radar data={radarChart} />
        </div>

        <div className="chart-card">
          <h2>API Usage Statistics</h2>
          <Bar data={usageChart} />
        </div>
      </section>
    </div>
  );
}