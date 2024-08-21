const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const crypto = require('crypto');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet'); // Importing the helmet library

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
    const query = `SELECT * FROM users WHERE id = ?`; // Using parameterized query
    connection.query(query, [userId], (err, results) => {  // Passing the userId as a parameter
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const safeCmd = cmd.replace(/[`$();&|]+/g, ''); // Cleaning the user-provided input
    exec(safeCmd, (err, stdout, stderr) => { // Executing the safe command
        if (err) {
            res.send(`Error: ${stderr}`);
            return;
        }
        res.send(`Output: ${stdout}`);
    });
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
    const randomNumber = crypto.randomInt(0, 100); // Secured random number generation
    res.send(`Random number: ${randomNumber}`);
});

// Applying helmet middleware
app.use(helmet());

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});