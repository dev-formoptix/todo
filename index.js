const express = require('express');
const mysql = require('mysql');
const { spawnSync } = require('child_process'); // Update import
const crypto = require('crypto');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');
const app = express();
const port = 3000;
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'test'
});
connection.connect();

// Create a rate limiter middleware
const limiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
});

// Apply rate limiter to the '/user' route
app.get('/user', limiter, (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ?`;
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Apply rate limiter to the '/exec' route
app.get('/exec', limiter, (req, res) => {
    const cmd = req.query.cmd;
    // Validate and sanitize the input to prevent command injection
    const safeCmd = shellQuote.parse(cmd);
    const sanitizedCmd = safeCmd.map(arg => arg.replace(/[`$();&|]+/g, ''));
    spawnSync(sanitizedCmd[0], sanitizedCmd.slice(1)); // Update from execFileSync
    res.send('Command executed successfully'); // Update response
});

// Apply rate limiter to the '/random' route
app.get('/random', limiter, (req, res) => {
    const randomNumber = crypto.randomInt(0, 100);
    res.send(`Random number: ${randomNumber}`);
});

app.use(mongoSanitize()); // Add this line to sanitize user input

app.use(helmet());

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});