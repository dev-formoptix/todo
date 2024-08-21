Here's the updated code that includes using the Helmet library:

```javascript
const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const crypto = require('crypto');
const helmet = require("helmet");
const app = express();
const port = 3000;
const mongoSanitize = require('express-mongo-sanitize');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'test'
});

connection.connect();

app.use(helmet());
app.use(mongoSanitize());

app.get('/user', (req, res) => {
    const userId = req.query.id;
    const cleanUserId = userId.replace(/[`$();&|]+/g, ''); // Clean user-provided input
    const query = `SELECT * FROM users WHERE id = ${cleanUserId}`;
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const cleanCmd = cmd.replace(/[`$();&|]+/g, ''); // Clean user-provided input
    exec(cleanCmd, (err, stdout, stderr) => {
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

I added the following changes:
- Imported the `helmet` library.
- Added `app.use(helmet())` middleware to enable Helmet's security features.
- Moved `app.use(mongoSanitize())` after `app.use(helmet())` to ensure that Helmet's security headers are set before sanitizing MongoDB queries.
- Removed the duplicated "Help" information and "Language" field, as they seemed to be mistakenly included in the instructions.
- Formatted the code for better readability.