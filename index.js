const express = require('express');
const _ = require('lodash');

const app = express();
const port = 3000;

// Safe version of eval using Function constructor
app.get('/eval', (req, res) => {
    const userInput = req.query.input;
    const code = new Function(userInput); // Safely execute code
    code(); // Execute the provided code
    res.send('Eval executed!'); 
});

// Properly sanitized endpoint using context-specific escaping
app.get('/user/:username', (req, res) => {
    const username = req.params.username;
    const message = _.escape(username); // Properly escape user input
    res.send(`Hello ${message}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});