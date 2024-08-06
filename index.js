const express = require('express');
const mysql = require('mysql');
const { spawnSync } = require('child_process');

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
    const query = `SELECT * FROM users WHERE id = ?`; // Use parameterized query to prevent SQL injection
    connection.query(query, userId, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const allowedCommands = [
        '/bin/ping',
        '/bin/host'
    ];
    if (!allowedCommands.includes(cmd)) {
        res.send('Invalid command');
        return;
    }
    const args = ['-c', '1', '--'];
    const command = spawnSync(cmd, args, { shell: false }); // Use spawnSync instead of exec to prevent command injection
    const stdout = command.stdout.toString();
    const stderr = command.stderr.toString();
    if (stderr) {
        res.send(`Error: ${stderr}`);
        return;
    }
    res.send(`Output: ${stdout}`);
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
    const randomNumber = Math.random(); // Insecure random number generation
    res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});