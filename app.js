
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const bidRoutes = require('./routes/bidRoutes');

const logger = require('./middleware/logger');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet());

app.use(rateLimit({ windowMs: 15*60*1000, max: 100 }));

app.use(logger);

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/bids', bidRoutes);

app.get('/api/featured-alumnus', async (req, res) => {
  const pool = require('./config/db');
  const result = await pool.query(
    "SELECT * FROM bids WHERE is_winner=true ORDER BY amount DESC LIMIT 1"
  );
  res.json(result.rows[0] || {});
});

const specs = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Alumni API',
      version: '1.0.0'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js']
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

module.exports = app;
