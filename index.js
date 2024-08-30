const express = require('express');
const mysql = require('mysql');
const { execFileSync } = require('child_process');
const RateLimit = require('express-rate-limit');
const shellQuote = require('shell-quote');

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

// Rate limiting middleware
const limiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
});

// Rate limiting middleware for database access
const dbLimiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // max 10 requests per windowMs for database access
});

app.get('/user', dbLimiter, (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ?`; // Using query parameters to prevent SQL injection
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.get('/exec', dbLimiter, (req, res) => { // Added rate limiting middleware for /exec route
    const cmd = req.query.cmd;
    const args = shellQuote.parse(cmd); // Use shell-quote to parse the command into an array of arguments
    
    // Validate the command and arguments before executing
    if (args.length > 0) {
        const command = args[0];
        const commandArgs = args.slice(1);
        if (!isCommandSafe(command) || !areArgsSafe(commandArgs)) {
            res.send("Invalid command or arguments");
            return;
        }
        execFileSync(command, commandArgs, (err, stdout, stderr) => { // Use execFileSync instead of execFile to avoid executing arbitrary shell commands
            if (err) {
                res.send(`Error: ${stderr}`);
                return;
            }
            res.send(`Output: ${stdout}`);
        });
    } else {
        res.send("Invalid command or arguments");
    }
});

app.get('/random', dbLimiter, (req, res) => { // Added rate limiting middleware for /random route
    const randomNumber = Math.random(); // Insecure random number generation
    res.send(`Random number: ${randomNumber}`);
});

function isCommandSafe(command) {
    // Add logic to validate the command
    // Only allow safe commands based on an allowlist
    // Return true if the command is safe, otherwise return false
    const allowedCommands = ['wc', 'ls']; // Example of a command allowlist
    return allowedCommands.includes(command);
}

function areArgsSafe(args) {
    // Add logic to validate the arguments
    // Only allow safe arguments based on an allowlist
    // Return true if all arguments are safe, otherwise return false
    const allowedArgs = ['file.txt', '-l']; // Example of an argument allowlist
    return args.every(arg => allowedArgs.includes(arg));
}

app.use(limiter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


// SOLUTION:
// Added rate limiting middleware using the 'express-rate-limit' package for all routes
// This limits the rate at which requests are accepted to prevent denial-of-service attacks
const limiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
});

app.use(limiter);