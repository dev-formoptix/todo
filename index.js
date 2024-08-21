const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const crypto = require('crypto');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet"); // Import helmet module

const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'test' 
});

connection.connect();

app.use(helmet()); // Use helmet middleware to configure HTTP headers

app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ${mysql.escape(userId)}`;
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const cleanedCmd = cmd.replace(/[`$();&|]+/g, '');
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});