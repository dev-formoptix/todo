const express = require('express');
const mysql = require('mysql');
const { spawnSync } = require('child_process');
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
    const cmdId = parseInt(req.query.cmdId);
    const host = req.query.host;
    const allowedCommands = [
        { exe: "/bin/ping", args: ["-c", "1", "--"] },
        { exe: "/bin/host", args: ["--"] }
    ];
  
    // Validate the cmdId to ensure it is within the allowedCommands array length
    if (cmdId >= 0 && cmdId < allowedCommands.length) {
        const cmd = allowedCommands[cmdId];
        const args = host ? cmd.args.concat(host) : cmd.args; // Check if host is provided
        const sanitizedArgs = args.map(arg => arg.replace(/[&|;`'"$]/g, ""));
        spawnSync(cmd.exe, sanitizedArgs);
        res.send('Command executed successfully');
    } else {
        res.status(400).send('Invalid cmdId');
    }
});

// Apply rate limiter to the '/random' route
app.get('/random', limiter, (req, res) => {
    const randomNumber = crypto.randomInt(0, 100);
    res.send(`Random number: ${randomNumber}`);
});

app.use(mongoSanitize());
app.use(helmet());

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});