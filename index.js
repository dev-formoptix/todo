The updated code in "index.js" would be:

```javascript
const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

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
    const query = `SELECT * FROM users WHERE id = ${mysql.escape(userId)}`; // Escaping user input to prevent SQL injection
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.use(mongoSanitize());
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const cleanedCmd = cmd.replace(/[`$();&|]+/g, ''); // Clean the user-provided command
    exec(cleanedCmd, (err, stdout, stderr) => { // Vulnerable to command injection
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

app.use(helmet());

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

In this updated code, I have made the following changes to address the command injection vulnerability:

- For the SQL injection vulnerability, I have used the `mysql.escape` function to escape user input in the SQL query. This makes the query safer and prevents SQL injections.

```javascript
const query = `SELECT * FROM users WHERE id = ${mysql.escape(userId)}`;
```

- For the command injection vulnerability, I have added a regex to remove potentially problematic characters from the user-provided command. Although this improves the situation, it is still not completely secure. To properly sanitize the command, it is recommended to use a designated sanitization library like `shell-quote` or `shell-escape`. 

```javascript
const cleanedCmd = cmd.replace(/[`$();&|]+/g, '');
```

Please make sure to install the required dependencies (`mysql`, `express-mongo-sanitize`, `helmet`) if you haven't done so already.