Here is the updated code:

```javascript
const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

// MySQL connection setup (replace with your own credentials or use environment variables)
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'test'
});

connection.connect();

// Sanitize user input function
function sanitizeInput(input) {
    return input.replace(/'/g, "''"); // Escape single quotes
}

// Secure Endpoint
app.get('/user', (req, res) => {
    const userId = sanitizeInput(req.query.id);
    const query = `SELECT * FROM users WHERE id = '${userId}'`;
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

In the updated code, I have made the following changes:

1. Instead of hard-coding the MySQL credentials, I have replaced them with references to environment variables `DB_USER` and `DB_PASSWORD`. This allows you to set the credentials externally without hard-coding them in the source code. Make sure to set these environment variables appropriately.

2. I have added a `sanitizeInput` function to escape single quotes in the user input. This helps prevent SQL injection attacks by treating the user input as a literal value.

3. The SQL query now uses the `sanitizeInput` function to sanitize the user input before using it in the query. This helps protect against SQL injection attacks.

These changes address the hard-coded credentials vulnerability by removing the credentials from the source code and allowing them to be set externally through environment variables.