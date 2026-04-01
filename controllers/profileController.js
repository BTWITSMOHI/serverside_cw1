
const pool = require('../config/db');

exports.createProfile = async(req,res)=>{
  const {full_name,bio,linkedin_url} = req.body;

  const result = await pool.query(
    'INSERT INTO profiles(user_id,full_name,bio,linkedin_url) VALUES($1,$2,$3,$4) RETURNING *',
    [req.user.userId,full_name,bio,linkedin_url]
  );

  res.json(result.rows[0]);
};
