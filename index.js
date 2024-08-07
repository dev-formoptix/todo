Here's an updated version of the code with the necessary changes to address the command injection vulnerability:

```javascript
const express = require('express');
const mysql = require('mysql');
const { spawn } = require('child_process');

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

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
  const userId = req.query.id;
  const query = 'SELECT * FROM users WHERE id = ?'; // Parameterized query to prevent SQL injection
  connection.query(query, [userId], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
  const cmd = req.query.cmd;
  const args = cmd.split(' ');
  const proc = spawn(args[0], args.slice(1), { shell: false }); // Execute command as a new process, not a shell
  let output = '';
  let error = '';

  proc.stdout.on('data', (data) => {
    output += data;
  });

  proc.stderr.on('data', (data) => {
    error += data;
  });

  proc.on('close', (code) => {
    if (code !== 0) {
      res.send(`Error: ${error}`);
      return;
    }
    res.send(`Output: ${output}`);
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

In the updated code, the `exec` function has been replaced with the `spawn` function from the `child_process` module. The command is split into an array of arguments using space as a delimiter, and then `spawn` is used to execute the command as a new process, rather than a shell. This change helps prevent command injection vulnerabilities.