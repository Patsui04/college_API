//Export the end point
module.exports = (app, databaseConnect) => {
  function checkingUserId(userId) {
    // Query to select UserID where RoleID is 1 and userId input from postman
    const query = `SELECT UserID FROM users WHERE RoleID = 1 AND UserID = ?;`;

    return new Promise((resolve, reject) => {
      databaseConnect.query(query, [userId], (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }

  function updateCourse(isAvailable, courseId) {
    //Query to update the availability of course in the database. 1 = Available and 0 = to not available
    const query = `UPDATE courses SET isAvailable = ? WHERE CourseID = ?`;

    return new Promise((resolve, reject) => {
      databaseConnect.query(query, [isAvailable, courseId], (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }

  //Pass the app.put method from express and defining route
  app.put("/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const { isAvailable, userId } = req.body;

    // Try and Catch functions to run two queries
    try {
      // Validating if the userId is a teacher
      // Need to pass as a parameter the userId
      const validateRole = await checkingUserId(userId);

      // Checking if validateRole has data or not
      if (!validateRole[0]) {
        return res.json({
          message: `You should be an admin to change course availability.`,
        });
      }

      // Running the update query to change the student mark
      await updateCourse(isAvailable, courseId);

      return res.json({ message: `Course ID ${courseId} has been updated.` });
    } catch (error) {
      // If any of these requests go wront, it will return an internal error
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
};
