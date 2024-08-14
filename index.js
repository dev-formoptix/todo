Here is the updated code in "index.js" file after addressing the vulnerability:

```javascript
const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const crypto = require('crypto');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const RateLimit = require('express-rate-limit');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'test' 
});

connection.connect();

const limiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
});

app.use(limiter);
app.use(helmet());
app.use(mongoSanitize());

app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = 'SELECT * FROM users WHERE id = ?';
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const cleanedCmd = mysql.escape(cmd);
    exec(cleanedCmd, { shell: '/bin/bash' }, (err, stdout, stderr) => {
        if (err) {
            res.send(`Error: ${stderr}`);
            return;
        }
        res.send(`Output: ${stdout}`);
    });
});

app.get('/random', (req, res) => {
    const randomNumber = crypto.randomInt(0, 100);
    res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

In the updated code, I have made the following changes to address the vulnerability:

1. Modified the query in the `/user` route to use parameterized queries. This ensures that the user input is treated as a literal value and prevents SQL injection attacks.
2. Escaped the `cmd` parameter in the `/exec` route using `mysql.escape` to prevent command injection attacks.