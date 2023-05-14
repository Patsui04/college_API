// Import 'mysql2' and 'express' modules
const mysql = require("mysql2");
const express = require("express");

// Calling the express module and defining server port
const app = express();
const port = 3000;

//Defining the database authentication
const databaseConnect = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "college_db",
});

//Create the connection to the database. If error, it would return a an error message.
databaseConnect.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database as ID " + databaseConnect.threadId);
});

// Create a connection to the server using app.get method.
// Path was set as /api and response function as the callback
app.get("/api", (req, response) => {
  //Create a query to retrieve data from users table in the database
  databaseConnect.query("SELECT * FROM users", (error, results, fields) => {
    if (error) {
      console.error("Error retrieving data: " + error.stack);
      return;
    }
    return response.send(results);
  });
});

//Check if server is listening to the connection
app.listen(port, () => {
  console.log(`College App listening on port ${port}`);
});
