const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const crypto = require('crypto');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
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

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ?`; 
    connection.query(query, [userId], (err, results) => {  
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const safeCmd = cmd.replace(/[`$();&|]+/g, ''); 
    exec(safeCmd, (err, stdout, stderr) => { 
        if (err) {
            res.send(`Error: ${stderr}`);
            return;
        }
        res.send(`Output: ${stdout}`);
    });
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
    const randomNumber = crypto.randomInt(0, 100); 
    res.send(`Random number: ${randomNumber}`);
});

// Applying helmet middleware
app.use(helmet());

// Adding rate limiting middleware
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
});

app.use((req, res, next) => {
  if (
    req.originalUrl === '/user' ||
    req.originalUrl === '/exec' ||
    req.originalUrl === '/random'
  ) {
    limiter(req, res, next);
  } else {
    next();
  }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});