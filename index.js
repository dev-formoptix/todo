const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');

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

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
  const userId = req.query.id;
  const query = 'SELECT * FROM users WHERE id = ?'; // Change to use parameterized queries
  connection.query(query, [userId], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
  const cmd = req.query.cmd;
  res.send(`Please provide a safe command.`);
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
  const randomNumber = Math.random(); // Insecure random number generation
  res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});