
require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 5001;

pool.connect().then(() => {
  console.log("DB connected");
  app.listen(PORT, () => console.log("Server running on port " + PORT));
});
