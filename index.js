Here's an updated version of the code with the `x-powered-by` header disabled to address the version information disclosure:

```javascript
const express = require('express');
const helmet = require("helmet");

const app = express();
const port = 3000;

// Disable x-powered-by header
app.disable("x-powered-by");

// MySQL connection setup
// ...

// SQL Injection Vulnerable Endpoint
// ...

// Command Injection Vulnerable Endpoint
// ...

// Secure Random Number Generation
// ...

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

In the updated code:
1. The `helmet` module is imported to use the `hidePoweredBy()` middleware.
2. The `x-powered-by` header is disabled using `app.disable("x-powered-by")`.
3. The vulnerable endpoints, such as SQL injection and command injection, are preserved for demonstration purposes. However, it is strongly recommended to address these vulnerabilities as well.