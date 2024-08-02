const express = require('express');
const mysql = require('mysql');
const { spawnSync } = require('child_process');
const base64 = require('base-64');

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
    const cmdId = parseInt(req.query.cmdId);
    let host = req.query.host;
    host = typeof host === "string"? host : "example.org";

    const allowedCommands = [
        {exe:"/bin/ping", args:["-c","1","--"]},
        {exe:"/bin/host", args:["--"]}
    ];
    const cmd = allowedCommands[cmdId];
    spawnSync(cmd.exe, cmd.args.concat(host)); // Use spawnSync instead of exec to prevent command injection
    res.send("Command executed successfully");
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
    const randomNumber = Math.random(); // Insecure random number generation
    res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});