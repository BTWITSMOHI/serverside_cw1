const pool = require('../config/db');

exports.apiUsageStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT endpoint, COUNT(*) as count
      FROM api_usage_logs
      GROUP BY endpoint
      ORDER BY count DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("USAGE STATS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// KPI summary
exports.getSummary = async (req, res) => {
  const total = await pool.query('SELECT COUNT(*) FROM users');

  const employed = await pool.query(`
    SELECT COUNT(*) 
    FROM employment 
    WHERE end_date IS NULL
  `);

  res.json({
    total_alumni: total.rows[0].count,
    employed: employed.rows[0].count
  });
};

// Programme distribution
exports.alumniByProgramme = async (req, res) => {
  const result = await pool.query(`
    SELECT programme, COUNT(*) as count
    FROM profiles
    GROUP BY programme
  `);

  res.json(result.rows);
};

// Industry sectors
exports.industrySectors = async (req, res) => {
  const result = await pool.query(`
    SELECT industry_sector, COUNT(*) as count
    FROM profiles
    GROUP BY industry_sector
  `);

  res.json(result.rows);
};

// Job titles
exports.jobTitles = async (req, res) => {
  const result = await pool.query(`
    SELECT job_title, COUNT(*) as count
    FROM profiles
    GROUP BY job_title
  `);

  res.json(result.rows);
};

// Top employers
exports.topEmployers = async (req, res) => {
  const result = await pool.query(`
    SELECT employer, COUNT(*) as count
    FROM profiles
    GROUP BY employer
    ORDER BY count DESC
    LIMIT 10
  `);

  res.json(result.rows);
};

// Top certifications / skills gap
exports.certificationSkillsGap = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT name, COUNT(*) as count
      FROM certifications
      GROUP BY name
      ORDER BY count DESC
      LIMIT 10
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("CERTIFICATION GAP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Alumni by graduation year
exports.graduationTrends = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT graduation_year, COUNT(*) as count
      FROM profiles
      WHERE graduation_year IS NOT NULL
      GROUP BY graduation_year
      ORDER BY graduation_year ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("GRADUATION TRENDS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Radar chart: overall alumni skill/category intelligence
exports.radarSkills = async (req, res) => {
  try {
    const certs = await pool.query(`SELECT COUNT(*) FROM certifications`);
    const degrees = await pool.query(`SELECT COUNT(*) FROM degrees`);
    const employment = await pool.query(`SELECT COUNT(*) FROM employment`);
    const profiles = await pool.query(`SELECT COUNT(*) FROM profiles`);
    const bids = await pool.query(`SELECT COUNT(*) FROM bids`);

    res.json([
      { label: "Certifications", value: Number(certs.rows[0].count) },
      { label: "Degrees", value: Number(degrees.rows[0].count) },
      { label: "Employment Records", value: Number(employment.rows[0].count) },
      { label: "Profiles", value: Number(profiles.rows[0].count) },
      { label: "Bids", value: Number(bids.rows[0].count) }
    ]);
  } catch (error) {
    console.error("RADAR SKILLS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAlumniOfDay = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT full_name, programme, job_title, employer
      FROM profiles
      ORDER BY RANDOM()
      LIMIT 1
    `);

    res.json(result.rows[0]);
  } catch (error) {
    console.error("ALUMNI OF DAY ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};