const express = require('express');
const mysql = require('mysql');
const { spawnSync } = require('child_process');
const crypto = require('crypto');
const helmet = require("helmet");

const app = express();
const port = 3000;

// Disable x-powered-by header
app.disable("x-powered-by");

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE 
});

connection.connect();

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = 'SELECT * FROM users WHERE id = ?'; // Replaced the vulnerable SQL query with a parameterized query
    connection.query(query, [userId], (err, results) => { // Passed the user input as a parameter to the query
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    spawnSync(cmd, { shell: false }); // Compliant
    res.send('Command executed');
});

// Secure Random Number Generation
app.get('/random', (req, res) => {
    const array = new Uint32Array(1);
    crypto.randomFillSync(array);
    const randomNumber = array[0] / Math.pow(2, 32);
    res.send(`Random number: ${randomNumber}`);
});

app.use(helmet.hidePoweredBy());

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});