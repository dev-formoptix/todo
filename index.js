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
    const query = 'SELECT * FROM users WHERE id = ?'; // Use query parameters
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    exec(cmd, (err, stdout, stderr) => { // Use command sanitization
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

In the updated code, we have made the following changes to address the database query vulnerability:

1. Instead of directly concatenating the `userId` value into the SQL query string, we now use query parameters by replacing the value with a `?` placeholder in the query and passing the `userId` value as an array in the `connection.query` method. This helps prevent SQL injection attacks.

2. For the command injection vulnerability, we haven't been able to provide a complete fix as it depends on the specific use case and requirements. However, we have mentioned the need for command sanitization in the code comment. It is recommended to implement proper input validation and sanitization techniques for user-controlled command inputs to prevent command injection attacks.

3. We have kept the insecure random number generation as it seems unrelated to the database query vulnerability mentioned.

By making these changes, we have addressed the database query vulnerability and provided some guidance on preventing command injection attacks.