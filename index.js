Here's the updated code that addresses the command injection vulnerability:

```javascript
const express = require('express');
const mysql = require('mysql');
const { execFile } = require('child_process');

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

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ?`; // Using prepared statement to prevent SQL injection
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const args = cmd.split(' '); // Splitting the command into an array of arguments
    execFile(args[0], args.slice(1), (err, stdout, stderr) => { // Using execFile to execute the command with arguments
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

In the updated code:
- For the SQL injection vulnerability, I've used prepared statements to prevent injection attacks. The user input is now treated as a parameter in the query.
- For the command injection vulnerability, I've split the user input command into an array of arguments and used `execFile` instead of `exec` to execute the command with arguments. This ensures that the user input is not passed directly to the shell command.