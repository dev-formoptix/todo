const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const { spawn } = require('child_process');

const app = express();
const port = 3000;

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'passwordd',
    database: 'test' 
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
    const cmdArray = cmd.split(' '); // Separate command and arguments
    const childProcess = spawn(cmdArray[0], cmdArray.slice(1), { shell: false }); // Use spawn instead of exec for safer execution
    
    childProcess.stdout.on('data', (data) => {
        res.send(`Output: ${data}`);
    });
    
    childProcess.stderr.on('data', (data) => {
        res.send(`Error: ${data}`);
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