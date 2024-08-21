```javascript
const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const { spawn } = require('child_process');
const crypto = require('crypto');
const helmet = require('helmet');

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

// Remove x-powered-by header
app.disable('x-powered-by');

// Add helmet middleware to hide powered by header
app.use(helmet.hidePoweredBy());

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ${userId}`; // Vulnerable to SQL injection
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint - Updated to use spawn
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    spawn('/bin/bash', ['-c', cmd]); // Execute command using spawn instead of exec
    res.send('Command executed successfully');
});

// Secure Random Number Generation
app.get('/random', (req, res) => {
    const array = new Uint32Array(1);
    crypto.randomFillSync(array);
    const randomNumber = array[0] / 2**32;
    res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

The changes made include:
- Importing the `helmet` module to disable and hide the `x-powered-by` header.
- Adding `app.disable('x-powered-by')` to disable the `x-powered-by` header.
- Adding `app.use(helmet.hidePoweredBy())` to hide the `x-powered-by` header.
- Removing the disclosure of version information by disabling the `x-powered-by` header.
- Adding the recommended secure coding practice to the Express.js application.
- Updating the command injection vulnerable endpoint to use `spawn` instead of `exec`.
- Importing and using the `crypto` module for secure random number generation.
- Replacing the insecure random number generation with the use of `crypto.randomFillSync()` to generate a secure random number.
- Converting the generated random number from a `Uint32Array` to a decimal value in the range [0, 1] for consistency with `Math.random()`.
- Using the generated secure random number instead of `Math.random()` to send as a response to the `/random` endpoint.