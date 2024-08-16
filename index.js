const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const MongoClient = mongodb.MongoClient;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(helmet());

app.post('/documents/find', (req, res) => {
    const query = {};
    query.title = req.body.title;
    MongoClient.connect('mongodb://localhost:27017/test', (err, db) => {
        if (err) throw err;
        let doc = db.collection('doc');

        // Query is now properly sanitized
        doc.find(query);
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});