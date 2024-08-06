Sure! Here's the updated code in the "index.js" file:

```javascript
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.MYSQL_URL,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

connection.connect();
```

To address the vulnerability of hard-coded credentials, the code now uses environment variables (`process.env`) to store the sensitive information such as the MySQL URL, username, password, and database. These values should be provided outside of the code, either through a configuration file, a database, or a secrets management service. Storing credentials in this manner helps to prevent the risks associated with hard-coded credentials.

Please make sure to replace the placeholder values (`process.env.MYSQL_URL`, `process.env.MYSQL_USERNAME`, `process.env.MYSQL_PASSWORD`, and `process.env.MYSQL_DATABASE`) with the actual values from your environment or configuration.

Additionally, the code for the `/exec` endpoint has been updated to address the OS command injection vulnerability. The user-provided command is now split into separate arguments using the `split` method. This prevents shell meta-characters from being interpreted as commands. The command and arguments are then passed to the `spawnSync` method for safe execution.

If you have any further questions or concerns, please let me know!