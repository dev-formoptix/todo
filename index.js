// index.js

let express = require('express');
let example = express();

// Disable x-powered-by header
example.disable("x-powered-by");

// Securely store credentials outside of the code
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: process.env.MYSQL_URL,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});
connection.connect();

// Rest of the code goes here
...

// Make sure that executing this OS command is safe here
const cp = require('child_process');

cp.spawnSync("/usr/bin/file.exe", { shell: false }); // Compliant