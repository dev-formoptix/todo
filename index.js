const express = require('express');
const mysql = require('mysql');
const { spawn } = require('child_process');
const crypto = require('crypto');
const helmet = require('helmet');

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

// Disable x-powered-by HTTP header
app.disable('x-powered-by');

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
    const args = cmd.split(' '); // Split the command into arguments
    const childProcess = spawn(args[0], args.slice(1)); // Execute the command safely
    
    let stdout = '';
    let stderr = '';

    childProcess.stdout.on('data', (data) => {
        stdout += data.toString();
    });

    childProcess.stderr.on('data', (data) => {
        stderr += data.toString();
    });

    childProcess.on('close', (code) => {
        if (code !== 0) {
            res.send(`Error: ${stderr}`);
        } else {
            res.send(`Output: ${stdout}`);
        }
    });
});

// Secure Random Number Generation
app.get('/random', (req, res) => {
    const array = new Uint32Array(1);
    crypto.randomFillSync(array);
    const randomNumber = array[0] / 4294967295; // Normalize the value to between 0 and 1
    res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});