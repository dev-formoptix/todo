Additionally, the code for the `/exec` endpoint has been updated to address the OS command injection vulnerability. Instead of directly executing the user-provided command with `spawnSync`, the command is split into an array of arguments and passed to `spawnSync`. This ensures that the command is executed safely without the risk of injection.

```javascript
app.get('/exec', (req, res) => {
  const cmd = req.query.cmd;
  const args = cmd.split(' ');
  const result = spawnSync(args[0], args.slice(1), { shell: false });

  let output = '';

  if (result.stdout) {
    output += result.stdout.toString();
  }

  if (result.stderr) {
    output += result.stderr.toString();
  }

  if (result.status === 0) {
    res.send(`Output: ${output}`);
  } else {
    res.send(`Error: ${output}`);
  }
});
```

Now, the code executes the command by providing each argument separately, which prevents any shell meta-characters from being interpreted as commands.