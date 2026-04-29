const pool = require("../config/db");

module.exports = async (req, res, next) => {
  res.on("finish", async () => {
    try {
      await pool.query(
        `INSERT INTO api_usage_logs(api_key_id, endpoint, method, status_code)
         VALUES($1, $2, $3, $4)`,
        [
          req.apiKey ? req.apiKey.id : null,
          req.originalUrl,
          req.method,
          res.statusCode,
        ]
      );
    } catch (error) {
      console.error("API USAGE LOG ERROR:", error);
    }
  });

  next();
};