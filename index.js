Here's the updated code that addresses the command-injection vulnerability:

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
    const query = `SELECT * FROM users WHERE id = ${connection.escape(userId)}`; // Escaping user input to prevent SQL injection
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const args = cmd.split(" "); // Splitting the command into arguments to prevent command injection
    execFile(args[0], args.slice(1), (err, stdout, stderr) => {
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

In the updated code, the following changes have been made:

1. Replaced `const { exec } = require('child_process')` with `const { execFile } = require('child_process')`. The `execFile` function is safer than `exec` as it doesn't rely on a shell for execution.

2. In the `/user` endpoint, used the `connection.escape` function to escape the `userId` to prevent SQL injection.

3. In the `/exec` endpoint, split the `cmd` string into an array of arguments using `split(" ")`. This prevents command injection by treating each argument separately.

Please note that these changes address the command-injection vulnerability, but there may be other security considerations to take into account depending on the specific requirements of your application.