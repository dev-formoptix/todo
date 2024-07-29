const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

// MySQL connection setup (replace with your own credentials or use environment variables)
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
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