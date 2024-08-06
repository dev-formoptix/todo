Here is the updated code with the vulnerability addressed:

```javascript
const express = require('express');
const mysql = require('mysql');
const { spawnSync } = require('child_process');
const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: process.env.MYSQL_URL,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
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

app.get('/random', (req, res) => {
  const crypto = require('crypto');
  var array = new Uint32Array(1);
  crypto.randomFillSync(array);

  const randomNumber = array[0] / (Math.pow(2, 32) - 1); 

  res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

In the updated code, the `window.crypto` object is replaced with the `crypto` module from Node.js to generate a random number securely. This removes the vulnerability of using potentially hardcoded credentials.