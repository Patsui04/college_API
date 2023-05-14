const mysql = require("mysql2");

const express = require("express");
const app = express();
const port = 3000;

const databaseConnect = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "college_db",
});

databaseConnect.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database as ID " + databaseConnect.threadId);
});

databaseConnect.query("SELECT * FROM users", (error, results, fields) => {
  if (error) {
    console.error("Error retrieving data: " + error.stack);
    return;
  }
  console.log("Retrieved " + results.length + " rows.");
  console.log(results);
});

app.get("/api", (req, response) => {
  databaseConnect.query("SELECT * FROM users", (error, results, fields) => {
    if (error) {
      console.error("Error retrieving data: " + error.stack);
      return;
    }
    return response.send(results);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
