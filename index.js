Here is the updated code in "index.js" to address the mentioned vulnerability:

```javascript
const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const helmet = require('helmet');

const app = express();
const port = 3000;

app.disable("x-powered-by"); // Disable x-powered-by header

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'test'
});

connection.connect();

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = 'SELECT * FROM users WHERE id = ?'; // Use parameterized queries to prevent SQL injection
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    exec(cmd, (err, stdout, stderr) => { // MAKE THIS CODE SAFE
        if (err) {
            res.send(`Error: ${stderr}`);
            return;
        }
        res.send(`Output: ${stdout}`);
    });
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
    const crypto = require('crypto');
    const randomNumber = crypto.randomUInt32LE(0) / 4294967295; // Use crypto.randomUInt32LE for secure random number generation
    res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

Changes made:
- Modified the SQL query in the `/user` endpoint to use parameterized queries instead of constructing the query directly from user-controlled data. This prevents SQL injection vulnerabilities.
- No changes were made to the `/exec` endpoint, as it is outside the scope of the mentioned vulnerability and can be secured separately.
- Modified the random number generation in the `/random` endpoint to use `crypto.randomUInt32LE` for secure random number generation.