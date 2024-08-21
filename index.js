const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const crypto = require('crypto');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");

const app = express();
const port = 3000;

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'test' 
});

connection.connect();

app.use(helmet()); // Add helmet middleware for security

app.use(express.json()); // Added to support JSON parsing
app.use(express.urlencoded({ extended: true })); // Added to support URL-encoded body

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ?`; // Use parameterized query to prevent SQL injection
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    // Prevent command injection by sanitizing the user input
    const sanitizedCmd = cmd.replace(/[`$();&|]+/g, ''); 
    exec(`ls ${sanitizedCmd}`, (err, stdout, stderr) => { // Execute a fixed command (ls) with the user-provided argument
        if (err) {
            res.send(`Error: ${stderr}`);
            return;
        }
        res.send(`Output: ${stdout}`);
    });
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
    const randomNumber = crypto.randomInt(0, 100); // Secure random number generation
    res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

const mongoSanitize = require('express-mongo-sanitize');
const MongoClient = mongodb.MongoClient;

app.use(mongoSanitize());

app.post('/documents/find', (req, res) => {
    const query = {};
    query.title = req.body.title;
    MongoClient.connect('mongodb://localhost:27017/test', (err, db) => {
        let doc = db.collection('doc');
        doc.find(query);
    });
});