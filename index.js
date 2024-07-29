const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Create connection to MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password', 
  database: 'mydatabase' 
});

// Connect to MySQL database
connection.connect();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Endpoint to authenticate user
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Use parameterized query to prevent SQL injection
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

  // Execute the SQL query with parameters
  connection.query(query, [username, password], (err, results) => {
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

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
