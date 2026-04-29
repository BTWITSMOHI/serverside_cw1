const pool = require('../config/db');

module.exports = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const apiKey = req.headers['x-api-key'];

      if (!apiKey) {
        return res.status(401).json({
          message: 'API key required'
        });
      }

      const result = await pool.query(
        'SELECT * FROM api_keys WHERE api_key = $1 AND is_active = true',
        [apiKey]
      );

      if (result.rows.length === 0) {
        return res.status(403).json({
          message: 'Invalid API key'
        });
      }

      const key = result.rows[0];

      console.log('API KEY FOUND:', key);

      const permissions = Array.isArray(key.permissions)
        ? key.permissions
        : String(key.permissions).replace(/[{}]/g, '').split(',');

      if (!permissions.includes(requiredPermission)) {
        return res.status(403).json({
          message: 'Permission denied'
        });
      }

      await pool.query(
        'UPDATE api_keys SET last_used_at = CURRENT_TIMESTAMP WHERE id = $1',
        [key.id]
      );

      req.apiKey = key;

      next();
    } catch (err) {
      console.error('API KEY MIDDLEWARE ERROR:', err);
      return res.status(500).json({
        message: 'Server error',
        error: err.message
      });
    }
  };
};