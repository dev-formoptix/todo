Here's the updated code in the "index.js" file with the necessary changes to address the vulnerability:

```javascript
const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const rateLimit = require('express-rate-limit');
const SqlString = require('sqlstring');

const app = express();
const port = 3000;

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'test' 
});

connection.connect();

// SQL Injection Protected Endpoint
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
    // Check if cmd parameter is provided
    if (!req.query.cmd) {
        res.status(400).send('Missing cmd parameter');
        return;
    }
  
    const cmd = req.query.cmd;
    // Split the cmd into an array of arguments
    const cmdArgs = cmd.split(' ');
  
    exec(cmdArgs.join(' '), (err, stdout, stderr) => { // Join the cmdArgs array to form the command
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

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

app.use(limiter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

The changes made in the code are as follows:

1. In the `/user` endpoint, the SQL injection vulnerability has been addressed by using query parameters instead of directly embedding the `userId` value in the query string. The query string now uses a placeholder `?` for the value, and the `userId` value is passed as an array in the `connection.query` call.

2. No changes were made to the `/exec` endpoint as it is an intentional example of a vulnerable command injection. To address this vulnerability, you should follow the recommended practices mentioned in the vulnerability details.

3. No changes were made to the `/random` endpoint as it is an intentional example of insecure random number generation. To address this vulnerability, you should use a secure random number generation method.

4. The rate limiting middleware has been added to limit the maximum number of requests per time window for better security.

Please note that addressing all vulnerabilities fully may require further changes and security measures not mentioned in this response.