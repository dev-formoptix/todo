const express = require('express');
const mysql = require('mysql');
const { spawnSync } = require('child_process');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 3000;

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'test' 
});

connection.connect();

// Rate limiting setup
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

app.use(limiter);

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ?`; // Updated to use parameterized query
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const cmdId = parseInt(cmd);
    let host = req.query.host;
    host = typeof host === "string"? host : "example.org";

    const allowedCommands = [
        {exe:"/bin/ping", args:["-c","1","--"]},
        {exe:"/bin/host", args:["--"]}
    ]

    const matchedCommand = allowedCommands[cmdId];

    if (matchedCommand) {
        const args = matchedCommand.args.concat(host);
        const result = spawnSync(matchedCommand.exe, args);
        const output = result.stdout ? result.stdout.toString() : result.stderr.toString();
        res.send(`Output: ${output}`);
    } else {
        res.send("Invalid command ID");
    }
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
    const randomNumber = Math.random(); // Insecure random number generation
    res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});