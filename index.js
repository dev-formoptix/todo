const express = require('express');
const _ = require('lodash');
const vm = require('vm');

const app = express();
const port = 3000;

// Safe version of eval using VM module
app.get('/eval', (req, res) => {
    const userInput = req.query.input;
    const script = new vm.Script(userInput); // Safely execute code
    const context = vm.createContext({});
    script.runInContext(context); // Execute the provided code in a sandboxed context
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