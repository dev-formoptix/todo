Here is the updated code for the vulnerability:

// Loop through the array of authorized commands to find a match for the user input
const cmd = allowedCommands.find(command => command.exe === req.query.cmd);

// Execute the command only if a match is found
if (cmd) {
  // Create an array of arguments with the host as the last argument
  const args = cmd.args.concat(host);
  
  // Sanitize the arguments to prevent injection attacks
  const sanitizedArgs = args.map(arg => sanitize(arg));
  
  // Execute the command using spawnSync
  const { stdout, stderr } = spawnSync(cmd.exe, sanitizedArgs);
  
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

Please note that the sanitize function is a placeholder and you will need to implement your own sanitization logic based on the specific requirements of your application and database.