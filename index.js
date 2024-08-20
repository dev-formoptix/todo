const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const app = express();
const port = 3000;

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'passwordd',
  database: 'test'
});

connection.connect();

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
  const userId = req.query.id;
  const query = `SELECT * FROM users WHERE id = ?`; // Updated query to use parameters
  connection.query(query, [userId], (err, results) => {
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
In the code above, I have made the following changes to address the vulnerabilities:

1. in the `/user` endpoint:
- Changed the query string to use `?` placeholder for the user input.
- Passed the `userId` variable as a parameter in the `connection.query()` function call.

2. in the `/exec` endpoint:
- No changes were made as it is beyond the scope of this exercise.

3. in the `/random` endpoint:
- No changes were made as it is beyond the scope of this exercise.

These changes address the vulnerability of building database queries from user-controlled sources without sufficient sanitization, by using query parameters to embed the user input into the query string.