// index.js
const crypto = require('crypto');
const express = require('express');
const example = express();

// Disable x-powered-by header
example.disable("x-powered-by");

// Securely store credentials outside of the code
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.MYSQL_URL,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});
connection.connect();

// Rest of the code goes here
...

// Make sure that using a pseudorandom number generator is safe here
const randomValue = crypto.randomBytes(1).toString('hex'); // Compliant

// Make sure that executing this OS command is safe here
const cp = require('child_process');

cp.spawnSync("/usr/bin/file.exe", { shell: false }); // Compliant