const express = require('express');
const mysql = require('mysql');
const helmet = require('helmet');

const app = express();

app.use(helmet());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydatabase'
});

app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (error, results) => {
    if (error) {
      res.status(500).send('Error retrieving users');
    } else {
      res.json(results);
    }
  });
});

app.post('/user', (req, res) => {
  const { name, email } = req.body;
  const query = `INSERT INTO users (name, email) VALUES (${mysql.escape(name)}, ${mysql.escape(email)})`;

  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).send('Error creating user');
    } else {
      res.status(201).send('User created successfully');
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});