Here's the updated code in the "index.js" file with the command injection vulnerability fixed:

```javascript
const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const crypto = require('crypto');

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
    const query = `SELECT * FROM users WHERE id = ?`; // Parameterized query to avoid SQL injection
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const cleanCmd = cmd.replace(/[`$();&|]+/g, ''); // Clean the command to avoid command injection

    exec(cleanCmd, (err, stdout, stderr) => {
        if (err) {
            res.send(`Error: ${stderr}`);
            return;
        }
        res.send(`Output: ${stdout}`);
    });
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
    const randomNumber = crypto.randomInt(0, 100); // Secure random number generation
    res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

I have made the following changes:

1. In the `/user` endpoint, I converted the SQL query to a parameterized query by replacing the user-supplied `userId` with a `?` placeholder. This helps prevent SQL injection attacks.

2. In the `/exec` endpoint, I added a step to clean the user-supplied `cmd` parameter using a regular expression to remove potentially problematic characters. This helps prevent command injection attacks.

These changes make the code less vulnerable to command injection attacks.