// ...

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
  const cmd = req.query.cmd;
  const sanitizedCmd = sanitizeCommand(cmd); // Sanitize the command
  
  // Constructing SQL queries directly from user-controlled data is vulnerable to SQL injection.
  // Instead, use parameterized queries or ORMs to interact with the database.
  const query = `SELECT * FROM users WHERE username = ?`;
  
  db.query(query, [sanitizedCmd], (err, rows) => {
    if (err) {
      res.send(`Error: ${err.message}`);
      return;
    }
    
    res.send(rows);
  });
});

function sanitizeCommand(cmd) {
  // Add your sanitization logic here
  // ...
  
  return sanitizedCmd;
}

// ...

// Disable x-powered-by header
app.disable('x-powered-by');

// ...