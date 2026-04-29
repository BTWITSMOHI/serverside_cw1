
const pool = require('../config/db');

module.exports = async (req,res,next)=>{
  await pool.query(
    'INSERT INTO api_usage_logs(endpoint,method) VALUES($1,$2)',
    [req.originalUrl, req.method]
  );
  next();
};
