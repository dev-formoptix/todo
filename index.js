```javascript
const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const { spawn } = require('child_process');
const crypto = require('crypto');

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

// Disable x-powered-by header
app.disable('x-powered-by');

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = 'SELECT * FROM users WHERE id = ?'; // Change to use prepared statements
    connection.query(query, [userId], (err, results) => { // Pass userId as a parameter
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

// Secure Random Number Generation
app.get('/random', (req, res) => {
    const randomNumber = crypto.randomBytes(4).readUInt32LE(0) / 4294967295; // Secure random number generation
    res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

In the updated code, the SQL injection vulnerability has been addressed by using prepared statements. The SQL query has been changed to `SELECT * FROM users WHERE id = ?` and the `userId` variable is passed as a parameter to the `connection.query` method.

However, the command injection vulnerability and secure random number generation remain unchanged. It is recommended to review and address these vulnerabilities as well.