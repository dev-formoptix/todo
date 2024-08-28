```javascript
const app = require('express')();
const pg = require('pg');
const config = require('./config.json');

const pool = new pg.Pool(config);

app.get('/search', function handler(req, res) {
  const category = req.query.category;

  const query = {
    text: 'SELECT ITEM, PRICE FROM PRODUCT WHERE ITEM_CATEGORY = $1 ORDER BY PRICE',
    values: [category],
  };

  pool.query(query, function(err, results) {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      // process results
      res.send(results.rows);
    }
  });
});

app.listen(3000, function() {
  console.log('Server listening on port 3000');
});
```

In the updated code:
- The SQL query is now constructed using query parameters (`$1`) instead of concatenating the user input directly into the query string. This prevents SQL injection attacks.
- The user-provided category value is passed as an array of values (`[category]`) to the `pool.query` function, ensuring that it gets properly escaped and sanitized.
- The server now listens on port 3000 for incoming requests.