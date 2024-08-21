Here's the updated code that addresses the vulnerability of building a database query from user-controlled sources:

```javascript
const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const RateLimit = require('express-rate-limit');

const app = express();
const port = 3000;

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'test',
});

connection.connect();

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
  const userId = req.query.id;
  const query = `SELECT * FROM users WHERE id = ?`; // Using query parameters
  connection.query(query, [userId], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
  const cmd = req.query.cmd;
  exec(cmd, (err, stdout, stderr) => {
    // Vulnerable to command injection
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

// Rate Limiter
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

app.use(limiter); // Apply rate limiter to all requests

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

In the `/user` endpoint, I replaced the vulnerability-prone query string with a parameterized query using `?` as a placeholder for the user input. The actual value of `userId` is then passed as an array in the `connection.query` function, ensuring it is properly sanitized and preventing SQL injection attacks.

However, please note that the `/exec` endpoint is still vulnerable to command injection. To address this, you should review the user input and validate/sanitize it before passing it to the `exec` function. For example, you can use a safe command execution library that gives you control over the executed command or restrict the allowed commands.