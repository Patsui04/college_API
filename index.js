// Import 'mysql2' and 'express' modules
const mysql = require("mysql2");
const express = require("express");

//Import the end points that would run the queries
const updateCourseAvailibity = require("./services/updateCoursesAvailibity");
const assignTeachersToCourses = require("./services/assignTeachersToCourses");
const studentsBrowseCourses = require("./services/studentsBrowseCourses");
const studentErol = require("./services/studentsEnrol");
const teachersMark = require("./services/teachersMark");

// Calling the express module and defining server port
const app = express();
const port = 3000;

// Middleware is responsible for parsing the request body as JSON.
app.use(express.json());

//Defining the database authentication
const databaseConnect = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "college_db",
});

// End point functions
updateCourseAvailibity(app, databaseConnect);
assignTeachersToCourses(app, databaseConnect);
studentsBrowseCourses(app, databaseConnect);
studentErol(app, databaseConnect);
teachersMark(app, databaseConnect);

//Create the connection to the database. If error, it would return a an error message.
databaseConnect.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database as ID " + databaseConnect.threadId);
});

//Check if server is listening to the connection
app.listen(port, () => {
  console.log(`College App listening on port ${port}`);
});
