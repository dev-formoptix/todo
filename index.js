const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const RateLimit = require('express-rate-limit');
const app = express();

function evaluateCode(code) {
  return eval(code);
}

const limiter = RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(bodyParser.json());
app.use('/login', limiter); // Apply rate limiter only to /login endpoint

const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: 'mydatabase',
});

connection.connect();

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
  const values = [username, password];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length > 0) {
      res.send('Login successful');
    } else {
      res.status(401).send('Invalid username or password');
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});