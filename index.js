// ...

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
  const cmd = req.query.cmd;
  exec(cmd, (err, stdout, stderr) => { // Vulnerable to command injection
    if (err) {
      res.send(`Error: ${stderr}`);
      return;
    }
    res.send(`Output: ${stdout}`);
  });
});

// ...

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
  const cmd = req.query.cmd;
  const sanitizedCmd = sanitizeCommand(cmd); // Sanitize the command
  exec(sanitizedCmd, (err, stdout, stderr) => {
    if (err) {
      res.send(`Error: ${stderr}`);
      return;
    }
    res.send(`Output: ${stdout}`);
  });
});

function sanitizeCommand(cmd) {
  // Add your sanitization logic here
  // ...

  return sanitizedCmd;
}

// ...