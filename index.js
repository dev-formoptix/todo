// index.js

let express = require('express');
let example = express();

// Disable x-powered-by header
example.disable("x-powered-by");

// Rest of the code goes here
...

This code disables the "x-powered-by" header in Express.js, which helps to prevent the disclosure of version information.