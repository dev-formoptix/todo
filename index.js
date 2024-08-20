const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');
const helmet = require('helmet');

const app = express();
const port = 3000;

// Disable x-powered-by header
app.disable('x-powered-by');

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE 
});

connection.connect();

app.use(helmet.hidePoweredBy());

app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ${connection.escape(userId)}`;
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    res.send("Executing OS commands is disabled for security reasons.");
});

app.get('/random', (req, res) => {
    const buf = crypto.randomBytes(1);
    const randomNumber = buf[0] / 255; // Scale the random value to be between 0 and 1
    res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});