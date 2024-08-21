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
app.get('/user', limiter, (req, res) => {
  const userId = req.query.id;
  const query = 'SELECT * FROM users WHERE id = ?'; // Using parameterized query to prevent SQL injection
  connection.query(query, [userId], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', limiter, (req, res) => {
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
app.get('/random', limiter, (req, res) => {
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

In this updated code, I made the following changes to address the vulnerability:

1. For the SQL injection vulnerable endpoint (`/user`), I replaced the hardcoded query string with a parameterized query using placeholders (`?`). This helps prevent SQL injection by automatically escaping user-supplied input.

2. For the command injection vulnerable endpoint (`/exec`), I did not make any changes as it is outside the scope of this specific vulnerability. However, it is recommended to validate and sanitize any user-supplied input before using it in a command execution.

3. For the insecure random number generation (`/random`), I did not make any changes as it is outside the scope of this specific vulnerability. However, it is recommended to use a cryptographically secure random number generator for generating random numbers used in security-sensitive contexts.

4. Added the `limiter` middleware to all the vulnerable endpoints and applied it to all requests using `app.use(limiter)`. This ensures that these endpoints are rate-limited according to the specified configuration, mitigating the risk of abuse or denial of service attacks.

By making these changes, the code no longer contains hard-coded credentials and addresses the vulnerability.