const pool = require('../config/db');

module.exports = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      'SELECT * FROM profiles WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length > 0) {
      return res.status(400).json({
        message: 'Profile already exists'
      });
    }

    next();

  } catch (error) {
    console.error('CHECK PROFILE ERROR:', error);
    res.status(500).json({
      message: 'Server error'
    });
  }
};