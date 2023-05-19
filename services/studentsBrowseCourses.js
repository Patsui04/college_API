//Export the end point
module.exports = (app, databaseConnect) => {
  function checkingUserId(userId) {
    // Student need to be 3
    const query = `SELECT UserID FROM users WHERE RoleID = 3 AND UserID = ?;`;

    return new Promise((resolve, reject) => {
      databaseConnect.query(query, [userId], (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }

  function gettingAvailableCourses() {
    // Perform the MySQL query to filter available courses and join teacher name
    const query = `
     SELECT courses.Title, users.Name
     FROM courses 
     INNER JOIN users ON courses.TeacherID = users.UserID
     WHERE isAvailable = 1;
   `;

    return new Promise((resolve, reject) => {
      databaseConnect.query(query, (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }

  //Pass the app.get method from express and defining route
  app.get("/student/:userId/available-courses", async (req, res) => {
    const { userId } = req.params;

    // Try and Catch functions to run two queries
    try {
      // Validating if the userId is a professor
      // Need to pass as a parameter the userId
      const validateRole = await checkingUserId(userId);

      // Checking if validateRole has data or not
      // If there is no data, that means that there is no professor
      if (!validateRole[0]) {
        return res.json({
          message: `You should be a student to see the available courses.`,
        });
      }

      // Running the update query to change the student mark
      const resultQuery = await gettingAvailableCourses();

      res.json(resultQuery);
    } catch (error) {
      // If any of these requests go wront, it will return an internal error
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
};
