To fix the vulnerability in the code, we need to replace the insecure random number generation with a cryptographically secure random number generator.

Here's the updated code:

```javascript
const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const dotenv = require('dotenv');
const crypto = require('crypto');

const app = express();
const port = 3000;

// Load environment variables from a .env file
dotenv.config();

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
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

// Cryptographically Secure Random Number Generation
app.get('/random', (req, res) => {
    const buffer = crypto.randomBytes(4); // Generate 4 random bytes
    const randomNumber = buffer.readUInt32BE(0) / 0x100000000; // Scale the random bytes to a number between 0 and 1
    res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

In the updated code:
- We added the `crypto` module to the list of required modules.
- Instead of using `Math.random()`, we now use `crypto.randomBytes()` to generate cryptographically secure random bytes.
- We then convert the random bytes to a number between 0 and 1 by dividing the 32-bit unsigned integer representation of the bytes by `0x100000000` (2^32).
- Finally, we send the random number as the response to the `/random` endpoint.