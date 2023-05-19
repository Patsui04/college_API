//Export the end point
module.exports = (app, databaseConnect) => {
  function checkingUserId(userId) {
    // Admin need to be 1
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

  function assignTeachersToCourses(teacherId, courseId) {
    const query = `UPDATE courses SET TeacherID = ? WHERE CourseID = ?`;

    return new Promise((resolve, reject) => {
      databaseConnect.query(query, [teacherId, courseId], (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }

  //Pass the app.put method from express and defining route
  app.put("/teacher/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const { teacherId, userId } = req.body;

    // Try and Catch functions to run two queries
    try {
      // Validating if the userId is a professor
      // Need to pass as a parameter the userId
      const validateRole = await checkingUserId(userId);

      // Checking if validateRole has data or not
      // If there is no data, that means that there is no admin
      if (!validateRole[0]) {
        return res.json({
          message: `You should be an admin to change to assign teachers to courses.`,
        });
      }

      // Running the update query to assign a professor to a course
      await assignTeachersToCourses(teacherId, courseId);

      res.json({
        message: `Teacher with the ID: ${teacherId} was assigned to the Course ID: ${courseId} sucessfully.`,
      });
    } catch (error) {
      // If any of these requests go wront, it will return an internal error
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
};
