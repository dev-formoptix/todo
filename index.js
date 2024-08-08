Here is the updated code in index.js:

```javascript
const express = require('express');
const mysql = require('mysql');
const { spawn } = require('child_process');
const crypto = require('crypto');

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

// Disable x-powered-by header
app.disable('x-powered-by');

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = 'SELECT * FROM users WHERE id = ?'; // Change to use prepared statements
    connection.query(query, [userId], (err, results) => { // Pass userId as a parameter
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    res.send("This endpoint is currently disabled.");
});

// Secure Random Number Generation
app.get('/random', (req, res) => {
    const randomNumber = crypto.randomBytes(4).readUInt32LE(0) / 4294967295; // Secure random number generation
    res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

In the updated code, the command injection vulnerability has been addressed by disabling the "/exec" endpoint and returning a message saying that the endpoint is currently disabled. This prevents user-controlled data from being directly used to construct OS commands.

Additionally, the code related to the "exec" function and the "child" variable has been removed as it is no longer needed.

Please note that this is a basic fix and there may be other security considerations depending on your specific use case. It is recommended to conduct a thorough security review of the application and implement additional measures as necessary.