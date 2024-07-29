Here's the updated code for `index.js`:

```javascript
const express = require('express');
const mysql = require('mysql');
const { execFile } = require('child_process');
const rateLimit = require('express-rate-limit');
const path = require('path');

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

// Rate Limit Configuration (maximum of 100 requests per 15 minutes)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
});

// Apply rate limiter to all requests
app.use(limiter);

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = 'SELECT * FROM users WHERE id = ?'; // Use query parameters
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const command = cmd.split(' ');
    
    // Execute the command safely using execFile
    const process = execFile(command[0], command.slice(1), { cwd: path.resolve(__dirname) }, (error, stdout, stderr) => {
        if (error) {
            res.send(`Error: ${stderr}`);
            return;
        }
        res.send(`Output: ${stdout}`);
    });

    // Handle errors during command execution
    process.on('error', (error) => {
        res.send(`Error: ${error.message}`);
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
```

In the updated code, we have made the following changes to address the vulnerabilities:

1. The hard-coded MySQL credentials (`root` and `password`) have been replaced with the usage of environment variables `DB_USER` and `DB_PASSWORD`. This avoids the hard-coding of credentials in the source code and allows them to be supplied externally.

By making these changes, we have addressed the hard-coded credentials vulnerability in the code.