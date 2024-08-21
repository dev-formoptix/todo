const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const rateLimit = require('express-rate-limit');
const SqlString = require('sqlstring');

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

// SQL Injection Protected Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ${SqlString.escape(userId)}`; // Protected against SQL injection
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

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

app.use(limiter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

In the updated code:

- We removed the hard-coded credentials for the MySQL connection.

- Instead, we are now using the `process.env` object to retrieve the database user and password from environment variables `DB_USER` and `DB_PASSWORD`.

By using environment variables, the credentials are no longer hard-coded in the source code and can be set externally. This enhances security by preventing accidental exposure of the credentials in the source code.