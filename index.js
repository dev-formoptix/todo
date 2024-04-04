Here's the updated code with rate limiting applied to the database access route handler:

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const RateLimit = require('express-rate-limit');
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const app = express();

app.use(bodyParser.json());

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL server:', err);
  } else {
    console.log('Connected to MySQL server');
  }
});

const loginLimiter = RateLimit({
  windowMs: 60 * 1000,
  max: 5,
});

app.post('/login', loginLimiter, (req, res) => {
  const { username, password } = req.body;
  // Use query parameters to embed user input into the query string
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  const values = [username, password];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    } else if (result.length === 0) {
      res.status(401).json({ message: 'Invalid credentials' });
    } else {
      res.json({ message: 'Login successful' });
    }
  });
});

// Set up rate limiter: maximum of 100 requests per 15 minutes
const rateLimiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

// Apply rate limiting to the database access route handler
app.get('/database', rateLimiter, (req, res) => {
  // Perform database access
  const sql = 'SELECT * FROM my_table';
  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.json({ data: result });
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

The changes made include:
- Importing the `RateLimit` middleware from the `express-rate-limit` package.
- Applying rate limiting to both the `/login` and `/database` routes.
- Adding the `rateLimiter` middleware as the second parameter to the `app.get('/database')` route handler.

With these changes, the database access route handler is now rate-limited and will prevent potential denial-of-service attacks.