const pool = require("../config/db");

module.exports = function apiKeyMiddleware(requiredPermission) {
  return async (req, res, next) => {
    try {
      const apiKey = req.headers["x-api-key"];

      if (!apiKey) {
        return res.status(401).json({ message: "API key missing" });
      }

      const result = await pool.query(
        "SELECT * FROM api_keys WHERE api_key = $1 AND is_active = true",
        [apiKey]
      );

      if (result.rows.length === 0) {
        return res.status(403).json({ message: "Invalid API key" });
      }

      const key = result.rows[0];

      // Check permission
      if (!key.permissions.includes(requiredPermission)) {
        return res.status(403).json({
          message: "Insufficient permissions",
        });
      }

      //Attach key to request
      req.apiKey = key;

      //Update last used
      await pool.query(
        "UPDATE api_keys SET last_used_at = NOW() WHERE id = $1",
        [key.id]
      );

      //LOG API USAGE AFTER RESPONSE FINISHES
      res.on("finish", () => {
        pool.query(
          `INSERT INTO api_usage_logs (api_key_id, endpoint, method, status_code)
           VALUES ($1, $2, $3, $4)`,
          [key.id, req.originalUrl, req.method, res.statusCode]
        ).catch(console.error);
      });

      next();
    } catch (error) {
      console.error("API Key Middleware Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
};