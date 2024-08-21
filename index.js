Here's an updated version of the code in the "index.js" file that addresses the hard-coded credentials vulnerability:

```javascript
const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const rateLimit = require('express-rate-limit');
const SqlString = require('sqlstring');

const app = express();
const port = 3000;

// MySQL connection setup (replace with your own credentials or use environment variables)
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER || 'root', // Use environment variable DB_USER or default to "root"
    password: process.env.DB_PASSWORD || 'password', // Use environment variable DB_PASSWORD or default to "password"
    database: 'test'
});

connection.connect();

// SQL Injection Protected Endpoint
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
    // Check if cmd parameter is provided
    if (!req.query.cmd) {
        res.status(400).send('Missing cmd parameter');
        return;
    }

    const cmd = req.query.cmd;
    // Split the cmd into an array of arguments
    const cmdArgs = cmd.split(' ');

    exec(cmdArgs.join(' '), (err, stdout, stderr) => { // Join the cmdArgs array to form the command
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

In this updated code, the hard-coded credentials have been replaced with the usage of environment variables. The `user` and `password` properties in the MySQL connection configuration now use `process.env.DB_USER` and `process.env.DB_PASSWORD`, respectively. If these environment variables are not set, it falls back to the default values of "root" as the user and "password" as the password.

By using environment variables, the sensitive credentials can be provided externally without hard-coding them in the source code. It also allows different credentials to be used in different environments (e.g., development, staging, production) without modifying the code.

Please make sure to set the `DB_USER` and `DB_PASSWORD` environment variables with the appropriate values when running the code in your environment.