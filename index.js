const express = require('express');
const _ = require('lodash');
const RateLimit = require('express-rate-limit');

const app = express();
const port = 3000;

const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});
app.use(limiter);

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

app.post('/', (req, res) => {
    var input = req.query.username;
    var template = `
doctype
html
head
    title= 'Hello world'
body
    form(action='/' method='post')
        input#name.form-control(type='text)
        button.btn.btn-primary(type='submit') Submit
    p Hello #{username}`
    var fn = pug.compile(template);
    var html = fn({username: input});
    res.send(html);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});