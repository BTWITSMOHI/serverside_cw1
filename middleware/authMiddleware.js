
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

module.exports = async (req,res,next)=>{
  const header = req.headers.authorization;
  if(!header) return res.status(401).json({message:'No token'});

  const token = header.split(' ')[1];

  const revoked = await pool.query('SELECT * FROM revoked_tokens WHERE token=$1',[token]);
  if(revoked.rows.length) return res.status(401).json({message:'Revoked'});

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.token = token;
    next();
  }catch{
    res.status(401).json({message:'Invalid'});
  }
};
