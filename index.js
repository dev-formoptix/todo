Here's an updated version of the code that addresses the potentially hardcoded credential vulnerability by removing the hard-coded password and using environment variables instead:

```javascript
const express = require('express');
const helmet = require("helmet");
const mysql = require('mysql');

const app = express();
const port = 3000;

// Disable x-powered-by header
app.disable("x-powered-by");

// MySQL connection setup
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// SQL Injection Vulnerable Endpoint
// ...

// Command Injection Vulnerable Endpoint
// ...

// Secure Random Number Generation
// ...

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

In the updated code:
1. The `mysql` module is imported to establish a connection with MySQL.
2. The MySQL connection is created using the `process.env` variables for the host, user, password, and database.
3. The connection is established with `connection.connect()`.
4. The vulnerable endpoints, such as SQL injection and command injection, are preserved for demonstration purposes. However, it is strongly recommended to address these vulnerabilities as well.

Make sure to set the appropriate environment variables (`MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`) with the actual values specific to your deployment environment. These environment variables should be stored securely and not hard-coded in the code.