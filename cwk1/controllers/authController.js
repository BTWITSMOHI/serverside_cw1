const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters and include uppercase, lowercase, and a number'
      });
    }

    
    if (!email.endsWith('@eastminster.ac.uk')) {
      return res.status(400).json({
        message: 'Only university emails (@eastminster.ac.uk) are allowed'
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await pool.query(
      'INSERT INTO users(email,password_hash) VALUES($1,$2) RETURNING *',
      [email, hash]
    );

    const token = crypto.randomBytes(32).toString('hex');

    await pool.query(
      `INSERT INTO tokens(user_id,token,token_type,expires_at)
       VALUES($1,$2,'verify',NOW()+INTERVAL '1 hour')`,
      [user.rows[0].id, token]
    );

    res.json({
      user: user.rows[0],
      verificationToken: token
    });

  } catch (error) {
    console.error('REGISTER ERROR:', error);
    res.status(500).json({
      message: 'Server error'
    });
  }
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

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await pool.query(
    'SELECT * FROM users WHERE email=$1',
    [email]
  );

  if (user.rows.length === 0) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const match = await bcrypt.compare(
    password,
    user.rows[0].password_hash
  );

  if (!match) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  //Here I set a expiration time for the token to 1 hour
  const token = jwt.sign(
    { userId: user.rows[0].id, email: user.rows[0].email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
};

exports.logoutUser = async(req,res)=>{
  await pool.query('INSERT INTO revoked_tokens(token) VALUES($1)',[req.token]);
  res.json({message:'logout'});
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    
    if (user.rows.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const userId = user.rows[0].id;

    const token = crypto.randomBytes(32).toString("hex");

    await pool.query(
      `INSERT INTO tokens (user_id, token, token_type, expires_at)
       VALUES ($1, $2, 'password_reset', NOW() + INTERVAL '1 hour')`,
      [userId, token]
    );

    res.json({
      message: "Password reset token generated",
      resetToken: token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async(req,res)=>{
  const {token,newPassword} = req.body;

  const t = await pool.query(
    "SELECT * FROM tokens WHERE token=$1 AND is_used=false",
    [token]
  );
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters and include uppercase, lowercase, and a number'
    });
  }
  const hash = await bcrypt.hash(newPassword,10);

  await pool.query(
    'UPDATE users SET password_hash=$1 WHERE id=$2',
    [hash,t.rows[0].user_id]
  );

  await pool.query('UPDATE tokens SET is_used=true WHERE id=$1',[t.rows[0].id]);

  res.json({message:'reset done'});
};
