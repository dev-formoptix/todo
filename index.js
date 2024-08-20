const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE 
});

connection.connect();

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
    exec(cmd, (err, stdout, stderr) => {
        if (err) {
            res.send(`Error: ${stderr}`);
            return;
        }
        res.send(`Output: ${stdout}`);
    });
});

app.get('/random', (req, res) => {
    const randomNumber = Math.random();
    res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});