const express = require('express');
const { exec } = require('child_process');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 3000;

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
  const cmd = req.query.cmd;
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      res.send(`Error: ${stderr}`);
      return;
    }
    res.send(`Output: ${stdout}`);
  });
});

// rate-limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

// Apply rate limiter to vulnerable endpoint
app.use('/exec', limiter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});