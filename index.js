const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const { spawn } = require('child_process');

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
    const query = `SELECT * FROM users WHERE id = ${userId}`; // Vulnerable to SQL injection
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const args = cmd.split(" ");
    const child = spawn(args[0], args.slice(1));
    let output = "";
    let error = "";
  
    child.stdout.on('data', (data) => {
        output += data;
    });

    child.stderr.on('data', (data) => {
        error += data;
    });

    child.on('close', (code) => {
        if (code !== 0) {
            res.send(`Error: ${error}`);
        } else {
            res.send(`Output: ${output}`);
        }
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