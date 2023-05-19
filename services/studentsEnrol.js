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

  function assignStudentEnrol(courseId, userId) {
    const query = `
        INSERT INTO enrolments (CourseID, UserID)
        SELECT ?, ? FROM DUAL
        WHERE NOT EXISTS (
          SELECT enrolments.CourseID, courses.CourseID, courses.isAvailable 
          FROM enrolments 
          INNER JOIN courses ON (enrolments.CourseID = courses.CourseID)
          WHERE enrolments.CourseID = ? and enrolments.UserID = ?);
      `;

    return new Promise((resolve, reject) => {
      databaseConnect.query(
        query,
        [courseId, userId, courseId, userId],
        (err, results) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  //Pass the app.put method from express
  app.post("/students-enrol", async (req, res) => {
    const { courseId, userId } = req.body;

    // Try and Catch functions to run two queries
    try {
      // Validating if the userId is a professor
      // Need to pass as a parameter the userId
      const validateRole = await checkingUserId(userId);

      // Checking if validateRole has data or not
      // If there is no data, that means that there is no professor
      if (!validateRole[0]) {
        return res.json({
          message: `You should be a student to enrol to courses.`,
        });
      }

      // Running the update query to change the student mark
      const resultQuery = await assignStudentEnrol(courseId, userId);

      if (resultQuery.affectedRows == "0")
        return res.json({ message: "You are already enroled to this course." });

      return res.json({
        message: resultQuery.affectedRows + " record(s) updated successfully",
      });
    } catch (error) {
      // If any of these requests go wront, it will return an internal error
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
};
