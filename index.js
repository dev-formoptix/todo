const express = require('express');
const mysql = require('mysql');
const RateLimit = require('express-rate-limit');

const app = express();

// Set up rate limiter middleware
const loginLimiter = RateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  message: 'Too many requests, please try again later.'
});

const databaseLimiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: 'Too many requests, please try again later.'
});

// Use middleware for rate limiting
app.use('/login', loginLimiter);
app.use('/database', databaseLimiter);

// Use environment variables for database credentials
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Login route
app.post('/login', (req, res) => {
  // Process login request
});

// Database route
app.get('/database', (req, res) => {
  // Process database request
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});