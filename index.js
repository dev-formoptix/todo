const express = require('express');
const mysql = require('mysql');
const { execFileSync } = require('child_process');
const crypto = require('crypto');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');
const shellQuote = require('shell-quote');
const app = express();
const port = 3000;
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'test' 
});
connection.connect();
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ?`;
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    const safeCmd = shellQuote.parse(cmd); 
    execFileSync(safeCmd[0], safeCmd.slice(1), (err, stdout, stderr) => { 
        if (err) {
            res.send(`Error: ${stderr}`);
            return;
        }
        res.send(`Output: ${stdout}`);
    });
});
app.get('/random', (req, res) => {
    const randomNumber = crypto.randomInt(0, 100);
    res.send(`Random number: ${randomNumber}`);
});

app.use(helmet());
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use((req, res, next) => {
  if (
    req.originalUrl === '/user' ||
    req.originalUrl === '/exec' ||
    req.originalUrl === '/random'
  ) {
    limiter(req, res, next);
  } else {
    next();
  }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});