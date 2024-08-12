const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
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

// Safe Query Building Function
function buildQuery(query, params) {
    return mysql.format(query, params);
}

// Safe Query Execution Helper Function
function executeQuery(query, params, callback) {
    connection.query(query, params, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = buildQuery('SELECT * FROM users WHERE id = ?', [userId]); // Safe query building
    executeQuery(query, [], (err, results) => { // Safe query execution
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.send(results);
        }
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    exec(cmd, (err, stdout, stderr) => { // Vulnerable to command injection
        if (err) {
            res.send(`Error: ${stderr}`);
            return;
        }
        res.send(`Output: ${stdout}`);
    });
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
    const randomNumber = Math.random(); // Insecure random number generation
    res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});