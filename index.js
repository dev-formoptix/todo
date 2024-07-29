const express = require('express');
const _ = require('lodash');

const app = express();
const port = 3000;

// Vulnerable endpoint using unsafe eval
app.get('/eval', (req, res) => {
    const userInput = req.query.input;
    eval(userInput); // Unsafe use of eval
    res.send('Eval executed!');
});

// Vulnerable endpoint with improper sanitization
app.get('/user/:username', (req, res) => {
    const username = req.params.username;
    const message = _.escape(username); // Insecure way to handle user input
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
