const express = require('express');
const mysql = require('mysql');
const helmet = require("helmet");

const app = express();
const port = 3000;

// Disable x-powered-by header
app.disable("x-powered-by");

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE 
});

connection.connect();

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ?`; // Use parameterized query to prevent SQL injection
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const safeCmd = cmd.split(' ').map(arg => {
        return arg.replace(/&|;|\||`|\\r|\\n/g, ''); // Sanitize input to prevent command injection
    }).join(' ');

    const commandOutput = spawnSync(safeCmd, { shell: false }); // Use spawnSync with shell set to false
    res.send(`Output: ${commandOutput.stdout.toString()}`);
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
    const randomNumber = Math.random(); // Insecure random number generation
    res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});