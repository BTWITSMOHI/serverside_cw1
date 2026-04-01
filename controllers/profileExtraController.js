const { sanitizeText } = require('../utils/sanitize');
const pool = require('../config/db');

exports.addDegree = async (req, res) => {
  try {
    let { degree_name, institution, year } = req.body;

    degree_name = sanitizeText(degree_name);
    institution = sanitizeText(institution);

    if (!degree_name || !institution || !year) {
      return res.status(400).json({
        message: 'degree_name, institution, and year are required'
      });
    }

    const result = await pool.query(
      'INSERT INTO degrees(user_id, degree_name, institution, year) VALUES ($1,$2,$3,$4) RETURNING *',
      [req.user.userId, degree_name, institution, year]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('ADD DEGREE ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addCertification = async (req, res) => {
  try {
    let { name, issuer, year } = req.body;

    name = sanitizeText(name);
    issuer = sanitizeText(issuer);

    if (!name || !issuer || !year) {
      return res.status(400).json({
        message: 'name, issuer, and year are required'
      });
    }

    const result = await pool.query(
      'INSERT INTO certifications(user_id, name, issuer, year) VALUES ($1,$2,$3,$4) RETURNING *',
      [req.user.userId, name, issuer, year]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('ADD CERTIFICATION ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addEmployment = async (req, res) => {
  try {
    let { company, role, start_date, end_date } = req.body;

    company = sanitizeText(company);
    role = sanitizeText(role);

    if (!company || !role || !start_date) {
      return res.status(400).json({
        message: 'company, role, and start_date are required'
      });
    }

    const result = await pool.query(
      'INSERT INTO employment(user_id, company, role, start_date, end_date) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [req.user.userId, company, role, start_date, end_date]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('ADD EMPLOYMENT ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};