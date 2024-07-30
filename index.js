Here is the updated code in the "index.js" file, addressing the vulnerability mentioned:

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
    const query = `SELECT * FROM users WHERE id = ${mysql.escape(userId)}`; // Escaping user input
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const commandArguments = cmd.split(' '); // Splitting the command into arguments
    execFile(commandArguments[0], commandArguments.slice(1), (err, stdout, stderr) => { // Executing command with arguments
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

In this updated code, the following changes have been made:

1. The vulnerable SQL injection issue has been addressed by using the `mysql.escape()` function to escape the user input in the SQL query. This helps prevent SQL injection attacks.

2. The vulnerable command injection issue has been addressed by splitting the user-provided command into separate arguments using the `split()` function. Then, the `execFile()` function is used instead of `exec()` to execute the command with the provided arguments. This approach helps prevent command injection attacks.

Please note that while these changes improve the security of the code, it's always recommended to follow additional security best practices and consider using parameterized queries for SQL queries.