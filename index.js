const express = require('express');
const mysql = require('mysql');
const { execFile } = require('child_process');
const RateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

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

const limiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
});

// SQL Injection Vulnerable Endpoint
app.get('/user', limiter, (req, res) => {
    const userId = req.query.id;
    const query = 'SELECT * FROM users WHERE id = ?';
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', limiter, (req, res) => {
    const cmd = req.query.cmd;
    const args = cmd.split(" ");
    args.forEach(arg => {
        if (containsInvalidCharacters(arg)) {
            res.send('Invalid characters in command');
            return;
        }
    });
    execFile(args[0], args.slice(1), (err, stdout, stderr) => {
        if (err) {
            res.send(`Error: ${stderr}`);
            return;
        }
        res.send(`Output: ${stdout}`);
    });
});

// Insecure Random Number Generation
app.get('/random', limiter, (req, res) => {
    const randomNumber = Math.random();
    res.send(`Random number: ${randomNumber}`);
});

// Secure file access with rate limiting
app.get('/:file', limiter, (req, res) => {
    let file = req.params.file;
    const filePath = path.join(__dirname, 'public', file);
    if (isValidPath(file) && isValidFilePath(filePath)) {
        filePath = fs.realpathSync(filePath); // Fix for Path Traversal vulnerability
        res.sendFile(filePath);
    } else {
        res.status(404).send('Invalid path');
    }
});

function isValidPath(path) {
    // Add validation or sanitization logic here to ensure only allowed files are served
    // Example validation: whitelist certain file extensions or check against a list of allowed paths
    const allowedExtensions = ['.jpg', '.png', '.pdf'];
    const allowedPaths = ['/images', '/documents'];
    
    // Check if the path has a whitelisted extension
    if (!allowedExtensions.some(ext => path.endsWith(ext))) {
        return false;
    }
    
    // Check if the path is in the list of allowed paths
    if (!allowedPaths.includes(path)) {
        return false;
    }
    
    return true;
}

function isValidFilePath(filePath) {
    // Perform additional checks on the file path to ensure it is secure
    // Example checks: normalize the path, resolve symbolic links, check against allowed root folder
    const ROOT = path.join(__dirname, 'public');

    // Normalize the file path and resolve symbolic links
    filePath = path.resolve(ROOT, filePath);
    
    // Check if the normalized path starts with the root folder
    if (!filePath.startsWith(ROOT)) {
        return false;
    }
    
    return true;
}

function containsInvalidCharacters(input) {
    const invalidCharacters = /[`$();&|]+/g;
    return invalidCharacters.test(input);
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});