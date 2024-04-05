```javascript
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Create connection to MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
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

  // Secure SQL query using query parameters
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  const values = [username, password];

  // Execute the SQL query
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

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

In this updated code, the hard-coded credentials for the MySQL database (`user` and `password`) have been replaced with environment variables (`process.env.DB_USER` and `process.env.DB_PASSWORD` respectively). This prevents the credentials from being hard-coded in the source code and allows them to be set externally through environment variables.

Additionally, the SQL query has been updated to use query parameters instead of directly concatenating the user inputs into the query. This makes the query secure and protects against SQL injection attacks.

Please make sure to set the appropriate values for the `DB_USER` and `DB_PASSWORD` environment variables when running this code in your environment.