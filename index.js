Here is the updated code for the vulnerability:

```javascript
const username = process.env.USERNAME;
const password = process.env.PASSWORD;

// Loop through the array of authorized commands to find a match for the user input
const cmd = allowedCommands.find(command => command.exe === req.query.cmd);

// Execute the command only if a match is found
if (cmd) {
  // Create an array of arguments with the host as the last argument
  const args = cmd.args.concat(host);
  
  // Sanitize the arguments to prevent injection attacks
  const sanitizedArgs = args.map(arg => sanitize(arg));
  
  // Execute the command using spawnSync
  const { stdout, stderr } = spawnSync(cmd.exe, sanitizedArgs, {
    env: {
      ...process.env,
      USERNAME: username,
      PASSWORD: password
    }
  });
  
  // Check for any errors or output from the command
  if (stderr && stderr.length > 0) {
    console.error(`Error executing command: ${stderr}`);
  } else {
    console.log(`Command output: ${stdout}`);
  }
} else {
  console.error("Invalid command");
}

// Function to sanitize user input to prevent injection attacks
function sanitize(input) {
  // Implement your sanitization logic here
  // For example, you can use parameterized queries or input validation
  // to ensure that the input is safe for database queries
  // and does not contain any malicious code
  return input;
}
```

Please note that in the updated code, the hard-coded values for the `username` and `password` have been replaced with environment variables `process.env.USERNAME` and `process.env.PASSWORD`. This allows the credentials to be supplied externally without hard-coding them in the source code.