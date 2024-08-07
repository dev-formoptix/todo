```javascript
const express = require('express');
const crypto = require('crypto');
const { spawn } = require('child_process');
const helmet = require('helmet');

const app = express();
const port = 3000;

app.disable("x-powered-by");
app.use(helmet.hidePoweredBy());

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
  const cmd = req.query.cmd;
  const args = cmd.split(' ');
  const proc = spawn(args[0], args.slice(1), { shell: false }); // Execute command as a new process, not a shell
  let output = '';
  let error = '';

  proc.stdout.on('data', (data) => {
    output += data;
  });

  proc.stderr.on('data', (data) => {
    error += data;
  });

  proc.on('close', (code) => {
    if (code !== 0) {
      res.send(`Error: ${error}`);
      return;
    }
    res.send(`Output: ${output}`);
  });
});

// Secure Random Number Generation
app.get('/random', (req, res) => {
  const randomBytes = crypto.randomBytes(4); // Generate 4 bytes of random data
  const randomNumber = randomBytes.readUInt32LE(0) / Math.pow(2, 32); // Convert the random bytes to a float between 0 and 1
  res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

In addition to addressing the version disclosure vulnerability, the code also includes the `helmet` middleware to enhance the security of the application by adding various HTTP headers. The `app.disable("x-powered-by")` statement disables the `x-powered-by` header, and the `app.use(helmet.hidePoweredBy())` statement adds further protection by hiding the powered-by information in the response headers.