const express = require('express');
const mysql = require('mysql');
const { execFile } = require('child_process');
const RateLimit = require('express-rate-limit');
const shellQuote = require('shell-quote');

const app = express();
const port = 3000;

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'test' 
});

connection.connect();

// Rate limiting middleware
const limiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

// Apply rate limiter to all requests
app.use(limiter);

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = 'SELECT * FROM users WHERE id = ?';
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    execFile('sh', ['-c', cmd], (err, stdout, stderr) => { // Execute command safely
        if (err) {
            res.send(`Error: ${stderr}`);
            return;
        }
        res.send(`Output: ${stdout}`);
    });
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
    const randomNumber = Math.random(); // Insecure random number generation
    res.send(`Random number: ${randomNumber}`);
});

app.get("/search", function handler(req, res) {
  // GOOD: use parameters
  var query =
    "SELECT ITEM,PRICE FROM PRODUCT WHERE ITEM_CATEGORY = ? ORDER BY PRICE";
  connection.query(query, [req.query.category], function(err, results) {
    // process results
    if (err) throw err;
    res.send(results);
  });
});

app.delete("/api/delete", async (req, res) => {
  let id = req.body.id;
  if (typeof id !== "string") {
    res.status(400).json({ status: "error" });
    return;
  }
  await Todo.deleteOne({ _id: id }); // GOOD: id is guaranteed to be a string

  res.json({ status: "ok" });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});