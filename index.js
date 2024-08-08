const express = require('express');
const mysql = require('mysql');
const { spawn } = require('child_process');
const crypto = require('crypto');
const helmet = require("helmet");

const app = express();
const port = 3000;

app.disable("x-powered-by");

// MySQL connection setup using environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

connection.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL:', error);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Endpoint to get user data, fixed SQL injection vulnerability
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;

  const query = 'SELECT * FROM users WHERE id = ?';
  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});

// Endpoint to execute a command, fixed command injection vulnerability
app.get('/exec', (req, res) => {
  const cmd = req.query.cmd;

  // Add command whitelisting to restrict allowed commands
  const allowedCommands = ['ls', 'pwd', 'echo'];
  if (!allowedCommands.includes(cmd)) {
    res.status(400).send('Invalid command');
    return;
  }

  const child = spawn(cmd);

  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });

  child.on('close', (code) => {
    res.send(output);
  });
});

// Endpoint to generate a random number using crypto module
app.get('/random', (req, res) => {
  const randomBytes = crypto.randomBytes(4);
  const randomNumber = randomBytes.readUInt32BE(0);
  res.json({ random: randomNumber });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});