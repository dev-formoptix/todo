const express = require('express');
const mysql = require('mysql');
const { spawnSync } = require('child_process');

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
    const query = 'SELECT * FROM users WHERE id = ?'; // Prepared statement to prevent SQL injection
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const args = cmd.split(' '); // Split command into arguments
    const process = spawnSync(args[0], args.slice(1)); // Use spawnSync with command arguments
    const output = process.stdout.toString('utf-8').trim();
    const error = process.stderr.toString('utf-8').trim();
    if (error) {
        res.send(`Error: ${error}`);
        return;
    }
    res.send(`Output: ${output}`);
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
    const random = Math.random(); // Insecure random number generation
    res.send(`Random number: ${random}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

In the updated code:
1. The MySQL connection credentials for `user` and `password` have been replaced with environment variables `DB_USER` and `DB_PASSWORD` respectively. This eliminates the hard-coded credentials in the source code.
2. The SQL injection vulnerability has been fixed by using prepared statements in the query.
3. The command injection vulnerability remains unchanged in this code. It is recommended to further sanitize and validate the user input before executing commands to prevent command injection attacks.
4. The insecure random number generation issue remains unchanged in this code. It is recommended to use a more secure random number generation method if cryptographic randomness is required.