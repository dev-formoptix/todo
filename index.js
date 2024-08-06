// Loop through the array of authorized commands to find a match for the user input
const cmd = allowedCommands.find(command => command.exe === req.query.cmd);

// Execute the command only if a match is found
if (cmd) {
  // Create an array of arguments with the host as the last argument
  const args = cmd.args.concat(host);
  // Execute the command using spawnSync
  const { stdout, stderr } = spawnSync(cmd.exe, args);
  // Check for any errors or output from the command
  if (stderr && stderr.length > 0) {
    console.error(`Error executing command: ${stderr}`);
  } else {
    console.log(`Command output: ${stdout}`);
  }
} else {
  console.error("Invalid command");
}

I hope this helps! Let me know if you have any other questions.