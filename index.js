Here is the updated code that addresses the database query vulnerability:

```javascript
const express = require('express');
const mysql = require('mysql');

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

1. Created a `sanitizeInput` function that escapes single quotes in the user input. This helps prevent SQL injection by treating the user input as a literal value.

2. Updated the SQL query to use the `sanitizeInput` function to sanitize the user input before using it in the query. This helps protect against SQL injection attacks.

These changes address the database query vulnerability by properly sanitizing the user input before building the query.