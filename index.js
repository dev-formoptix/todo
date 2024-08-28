Here are the updated contents of the "index.js" file, addressing the missing rate limiting vulnerability:

```javascript
const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 3000;

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
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
    exec(cmd, (err, stdout, stderr) => { // Vulnerable to command injection
        if (err) {
            res.send(`Error: ${stderr}`);
            return;
        }
        res.send(`Output: ${stdout}`);
    });
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
    const randomNumber = Math.random(); // Insecure random number generation
    res.send(`Random number: ${randomNumber}`);
});

// Apply rate limiting middleware to all endpoints
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
});
app.use(limiter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

The changes include:
1. Adding the `express-rate-limit` package and requiring it in the file.
2. Creating a rate limiter middleware with a window of 15 minutes and a maximum of 100 requests per window.
3. Applying the rate limiter middleware to all endpoints using `app.use(limiter)`.