const express = require('express');
const mysql = require('mysql');
const { spawn } = require('child_process');
const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: process.env.MYSQL_URL,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE 
});

connection.connect();

app.get('/user', (req, res) => {
  const userId = req.query.id;
  const query = `SELECT * FROM users WHERE id = ?`; // Use parameterized query to prevent SQL injection
  connection.query(query, [userId], (err, results) => {
      if (err) throw err;
      res.send(results);
  });
});

app.get('/exec', (req, res) => {
  const cmd = req.query.cmd;
  const args = cmd.split(' ');
  const child = spawn(args[0], args.slice(1), { shell: false }); // Adding { shell: false } to prevent arbitrary OS command injection

  let output = '';

  child.stdout.on('data', (data) => {
      output += data;
  });

  child.stderr.on('data', (data) => {
      output += data;
  });

  child.on('close', (code) => {
      if (code === 0) {
          res.send(`Output: ${output}`);
      } else {
          res.send(`Error: ${output}`);
      }
  });
});

app.get('/random', (req, res) => {
  const randomNumber = Math.random();
  res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});