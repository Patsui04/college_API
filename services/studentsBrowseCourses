//Export the end point
module.exports = (app, databaseConnect) => {
  //Pass the app.get method from express and defining route
  app.get("/available-courses", (req, res) => {
    // Perform the MySQL query to filter available courses and join teacher name
    const query = `
        SELECT courses.Title, users.Name
        FROM courses 
        INNER JOIN users ON courses.TeacherID = users.UserID
        WHERE isAvailable = 1;
      `;

    databaseConnect.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching the data:", err);
        res.status(500).json({ error: "Failed to retrieve available courses" });
        return;
      }

      return res.json(results);
    });
  });
};
