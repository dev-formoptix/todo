Here's the updated code for `index.js`:

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
    user: 'root',
    password: 'password',
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

In the updated code, we have added the `express-rate-limit` package and created a rate limiter middleware using the `rateLimit` function. The rate limiter is set to allow a maximum of 100 requests per 15 minutes.

We then applied the rate limiter middleware to all requests using `app.use(limiter)`.

By adding rate limiting, we have addressed the missing rate limiting vulnerability in the code and added protection against denial-of-service attacks.