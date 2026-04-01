const pool = require('../config/db');

exports.placeBid = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.userId;

  // Increase-only rule
  const last = await pool.query(
    'SELECT * FROM bids WHERE user_id=$1 ORDER BY amount DESC LIMIT 1',
    [userId]
  );

  if (last.rows.length && amount <= last.rows[0].amount) {
    return res.status(400).json({ message: 'You must increase your bid' });
  }

  // Monthly win limit
  const wins = await pool.query(
    `SELECT COUNT(*) FROM bids 
     WHERE user_id=$1 AND is_winner=true 
     AND DATE_TRUNC('month', bid_date)=DATE_TRUNC('month', CURRENT_DATE)`,
    [userId]
  );

  if (parseInt(wins.rows[0].count) >= 3) {
    return res.status(400).json({ message: 'Monthly win limit reached' });
  }

  // Insert bid
  const numericAmount = Number(amount);

if (!Number.isInteger(numericAmount) || numericAmount <= 0) {
  return res.status(400).json({
    message: 'Bid amount must be a positive integer'
  });
}

  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({
      message: 'Bid amount must be a positive number'
    });
  }
  const bid = await pool.query(
    'INSERT INTO bids(user_id,amount) VALUES($1,$2) RETURNING *',
    [userId, amount]
  );

  // Blind bidding logic
  const highest = await pool.query(
    'SELECT id, user_id FROM bids ORDER BY amount DESC LIMIT 1'
  );

  const status = highest.rows[0].id === bid.rows[0].id
    ? 'Currently highest bid'
    : 'Bid placed (status hidden)';

  res.json({
    message: status,
    bid_id: bid.rows[0].id
  });
};

exports.selectWinner = async (req, res) => {
  const highest = await pool.query(
    'SELECT * FROM bids ORDER BY amount DESC LIMIT 1'
  );

  await pool.query(
    'UPDATE bids SET is_winner=true WHERE id=$1',
    [highest.rows[0].id]
  );

  res.json({
    message: 'Winner selected',
    winner: highest.rows[0]
  });
};