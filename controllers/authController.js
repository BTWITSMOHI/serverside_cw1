
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.registerUser = async (req,res)=>{
  const {email,password} = req.body;

  const hash = await bcrypt.hash(password,10);

  const user = await pool.query(
    'INSERT INTO users(email,password_hash) VALUES($1,$2) RETURNING *',
    [email,hash]
  );

  const token = crypto.randomBytes(32).toString('hex');

  await pool.query(
    `INSERT INTO tokens(user_id,token,token_type,expires_at)
     VALUES($1,$2,'verify',NOW()+INTERVAL '1 hour')`,
    [user.rows[0].id,token]
  );

  res.json({user:user.rows[0],verificationToken:token});
};

exports.verifyEmail = async(req,res)=>{
  const {token} = req.body;

  const t = await pool.query(
    "SELECT * FROM tokens WHERE token=$1 AND is_used=false",
    [token]
  );

  await pool.query("UPDATE users SET is_verified=true WHERE id=$1",[t.rows[0].user_id]);
  await pool.query("UPDATE tokens SET is_used=true WHERE id=$1",[t.rows[0].id]);

  res.json({message:'verified'});
};

exports.loginUser = async(req,res)=>{
  const {email,password} = req.body;

  const user = await pool.query('SELECT * FROM users WHERE email=$1',[email]);

  const match = await bcrypt.compare(password,user.rows[0].password_hash);

  const token = jwt.sign({userId:user.rows[0].id},process.env.JWT_SECRET);

  res.json({token});
};

exports.logoutUser = async(req,res)=>{
  await pool.query('INSERT INTO revoked_tokens(token) VALUES($1)',[req.token]);
  res.json({message:'logout'});
};

exports.requestPasswordReset = async(req,res)=>{
  const {email} = req.body;

  const user = await pool.query('SELECT * FROM users WHERE email=$1',[email]);

  const token = crypto.randomBytes(32).toString('hex');

  await pool.query(
    `INSERT INTO tokens(user_id,token,token_type,expires_at)
     VALUES($1,$2,'reset',NOW()+INTERVAL '1 hour')`,
    [user.rows[0].id,token]
  );

  res.json({resetToken:token});
};

exports.resetPassword = async(req,res)=>{
  const {token,newPassword} = req.body;

  const t = await pool.query(
    "SELECT * FROM tokens WHERE token=$1 AND is_used=false",
    [token]
  );

  const hash = await bcrypt.hash(newPassword,10);

  await pool.query(
    'UPDATE users SET password_hash=$1 WHERE id=$2',
    [hash,t.rows[0].user_id]
  );

  await pool.query('UPDATE tokens SET is_used=true WHERE id=$1',[t.rows[0].id]);

  res.json({message:'reset done'});
};
