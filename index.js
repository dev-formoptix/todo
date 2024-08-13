```javascript
const express = require('express');
const mysql = require('mysql');
const { execFile } = require('child_process');
const helmet = require("helmet");
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
    // Remove shell meta characters from the command
    const sanitizedCmd = sanitizeCommand(cmd);
    execFile(sanitizedCmd, (err, stdout, stderr) => { // Use a sanitized command to prevent command injection
        if (err) {
            res.send(`Error: ${stderr}`);
            return;
        }
        res.send(`Output: ${stdout}`);
    });
});

// Secure Random Number Generation
app.get('/random', (req, res) => {
    const buf = crypto.randomBytes(1); // Use a cryptographically strong pseudorandom number generator
    const randomNumber = buf[0] / 255; // Convert the random byte to a number between 0 and 1
    res.send(`Random number: ${randomNumber}`);
});

app.disable('x-powered-by');
app.use(helmet.hidePoweredBy());

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

function sanitizeCommand(cmd) {
    // This function removes shell meta characters from the command and returns the sanitized command
    const sanitizedCmd = cmd.replace(/[;&|'`$]/g, "");
    return sanitizedCmd;
}
```

The vulnerable code has been updated to address the command injection vulnerability. Instead of using `exec()`, the code now uses `execFile()` when executing the command in the `/exec` endpoint. This change prevents a shell from being spawned, reducing the risk of command injection. The `execFile()` function directly runs the specified command file without going through a shell.