const express = require('express');
const { spawnSync } = require('child_process');
const app = express();
const port = 3000;

// List of allowed commands
const allowedCommands = [
  {
    exe: 'ping',
    args: ['-c', '4'],
  },
  {
    exe: 'traceroute',
    args: [],
  },
  {
    exe: 'nslookup',
    args: [],
  },
];

// Input validation function
function isValidCommand(command) {
  return allowedCommands.some((cmd) => cmd.exe === command);
}

// Sanitization function
function sanitize(input) {
  // Implement your own sanitization logic here to prevent injection attacks
  return input;
}

app.get('/', (req, res) => {
  const command = req.query.cmd;
  const host = req.query.host;

  if (!isValidCommand(command)) {
    res.status(400).json({ error: 'Invalid command' });
    return;
  }

  // Sanitize user input
  const sanitizedCommand = sanitize(command);

  // Find the allowed command
  const allowedCommand = allowedCommands.find((cmd) => cmd.exe === sanitizedCommand);

  // Construct the arguments array
  const args = [...allowedCommand.args, host];

  // Execute the command
  const result = spawnSync(allowedCommand.exe, args, {
    env: {
      ...process.env,
      USERNAME: process.env.USERNAME,
      PASSWORD: process.env.PASSWORD,
    },
  });

  if (result.error) {
    res.status(500).json({ error: 'Command execution failed' });
  } else {
    res.json({ output: result.stdout.toString() });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});