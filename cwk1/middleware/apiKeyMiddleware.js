const pool = require("../config/db");

module.exports = function apiKeyMiddleware(requiredPermission) {
  return async (req, res, next) => {
    try {
      const apiKey = req.headers["x-api-key"];

      if (!apiKey) {
        return res.status(401).json({
          message: "API key required",
        });
      }

      const result = await pool.query(
        "SELECT * FROM api_keys WHERE api_key = $1 AND is_active = true",
        [apiKey]
      );

      if (result.rows.length === 0) {
        return res.status(403).json({
          message: "Invalid API key",
        });
      }

      const key = result.rows[0];

      if (!key.permissions.includes(requiredPermission)) {
        return res.status(403).json({
          message: "Permission denied",
        });
      }

      await pool.query(
        "UPDATE api_keys SET last_used_at = CURRENT_TIMESTAMP WHERE id = $1",
        [key.id]
      );

      req.apiKey = key;

      // Logs the API key usage after the response is completed,
      // so the final HTTP status code is recorded correctly.
      res.on("finish", () => {
        pool
          .query(
            `INSERT INTO api_usage_logs (api_key_id, endpoint, method, status_code)
             VALUES ($1, $2, $3, $4)`,
            [key.id, req.originalUrl, req.method, res.statusCode]
          )
          .catch((err) => {
            console.error("usage log insert failed:", err);
          });
      });

      next();
    } catch (error) {
      console.error("API KEY MIDDLEWARE ERROR:", error);
      return res.status(500).json({
        message: "Server error",
      });
    }
  };
};