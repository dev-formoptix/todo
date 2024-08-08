const express = require('express');
const mysql = require('mysql');
const { execSync } = require('child_process');
const { QueryTypes } = require('sequelize');
const RateLimit = require('express-rate-limit');

const app = express();
const port = 3000;

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'test' 
});

connection.connect();

// Rate limiting setup with maximum of 100 requests per 15 minutes
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // max 100 requests per windowMs
});

// Apply rate limiter to all requests
app.use(limiter);

// SQL Injection Vulnerable Endpoint
app.get('/user', async (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ?`; // Use prepared statement
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const args = cmd.split(' '); // Split command into arguments
    const result = execSync(args[0], args.slice(1)); // Execute command and arguments
    res.send(result.toString());
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
    const randomNumber = Math.random(); // Insecure random number generation
    res.send(`Random number: ${randomNumber}`);
});

// Add rate limiter middleware for the database access endpoint
app.use('/user', limiter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});