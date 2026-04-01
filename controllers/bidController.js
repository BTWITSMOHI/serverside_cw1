
const pool = require('../config/db');

exports.placeBid = async(req,res)=>{
  const {amount} = req.body;

  const bid = await pool.query(
    'INSERT INTO bids(user_id,amount) VALUES($1,$2) RETURNING *',
    [req.user.userId,amount]
  );

  res.json(bid.rows[0]);
};

exports.selectWinner = async(req,res)=>{
  const highest = await pool.query(
    'SELECT * FROM bids ORDER BY amount DESC LIMIT 1'
  );

  await pool.query('UPDATE bids SET is_winner=true WHERE id=$1',[highest.rows[0].id]);

  res.json(highest.rows[0]);
};
