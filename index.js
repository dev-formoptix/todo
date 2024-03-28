const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const RateLimit = require('express-rate-limit');

function evaluateCode(code) {
  return eval(code);
}

const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydatabase'
});

connection.connect();

app.use(bodyParser.json());

// Set up rate limiter: maximum of 100 requests per 15 minutes
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// Apply rate limiter to all requests
app.use(limiter);

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  connection.query(query, (err, results) => {
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