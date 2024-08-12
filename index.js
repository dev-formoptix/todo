const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const helmet = require("helmet");

const app = express();
const port = 3000;

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
    host: process.env.MYSQL_URL,
    user: process.env.MYSQL_USERNAME,
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
    // const sanitizedCmd = cmd.replace(/[;&|'`$]/g, ""); // Remove shell meta characters from the command
    // exec(sanitizedCmd, (err, stdout, stderr) => { // Use a sanitized command to prevent command injection
    //     if (err) {
    //         res.send(`Error: ${stderr}`);
    //         return;
    //     }
    //     res.send(`Output: ${stdout}`);
    // });
    res.send('This endpoint has been disabled for security reasons');
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
    const randomNumber = Math.random(); // Insecure random number generation
    res.send(`Random number: ${randomNumber}`);
});

app.disable('x-powered-by');
app.use(helmet.hidePoweredBy());

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});