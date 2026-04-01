const pool = require('../config/db');
const { sanitizeText } = require('../utils/sanitize');

exports.createProfile = async (req, res) => {
  try {
    let { full_name, bio, linkedin_url } = req.body;

    full_name = sanitizeText(full_name);
    bio = sanitizeText(bio);
    linkedin_url = sanitizeText(linkedin_url);

    if (!full_name || !bio || !linkedin_url) {
      return res.status(400).json({
        message: 'full_name, bio, and linkedin_url are required'
      });
    }

    const result = await pool.query(
      'INSERT INTO profiles(user_id, full_name, bio, linkedin_url) VALUES($1, $2, $3, $4) RETURNING *',
      [req.user.userId, full_name, bio, linkedin_url]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('CREATE PROFILE ERROR:', error);
    res.status(500).json({
      message: 'Server error'
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const profileResult = await pool.query(
      'SELECT * FROM profiles WHERE user_id = $1',
      [userId]
    );

    if (profileResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Profile not found'
      });
    }

    const degrees = await pool.query(
      'SELECT * FROM degrees WHERE user_id = $1',
      [userId]
    );

    const certifications = await pool.query(
      'SELECT * FROM certifications WHERE user_id = $1',
      [userId]
    );

    const employment = await pool.query(
      'SELECT * FROM employment WHERE user_id = $1',
      [userId]
    );

    res.json({
      profile: profileResult.rows[0],
      degrees: degrees.rows,
      certifications: certifications.rows,
      employment: employment.rows
    });
  } catch (error) {
    console.error('GET PROFILE ERROR:', error);
    res.status(500).json({
      message: 'Server error'
    });
  }
};