//Export the end point
module.exports = (app, databaseConnect) => {
  function checkingUserId(userId) {
    // Query to selct UserID of Admins (Role 2)
    const query = `SELECT UserID FROM users WHERE RoleID = 2 AND UserID = ?;`;

    return new Promise((resolve, reject) => {
      databaseConnect.query(query, [userId], (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }

  //Query to give the teacherID based on the provided enrolmentID and userID
  function checkCourseTeacher(enrolmentId, userId) {
    const query = `SELECT TeacherID FROM courses 
    JOIN enrolments ON courses.CourseID = enrolments.CourseID
    WHERE enrolments.EnrolmentID = ? AND courses.TeacherID = ?;`;

    return new Promise((resolve, reject) => {
      databaseConnect.query(query, [enrolmentId, userId], (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }

  //Query to update the Mark based on enrolmentID
  function changingStudentMark(mark, enrolmentId) {
    const query = `UPDATE enrolments SET Mark = ? WHERE EnrolmentID = ?`;

    return new Promise((resolve, reject) => {
      databaseConnect.query(query, [mark, enrolmentId], (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }

  //Pass the app.put method from express and defining route
  // Need to do an asycn function to get the userRolesValidation first
  app.put("/enrolment/:enrolmentId", async (req, res) => {
    const { enrolmentId } = req.params;
    const { mark, userId } = req.body;

    // Try and Catch functions to run two queries
    try {
      // Validating if the userId is a professor
      // Need to pass as a parameter the userId
      const validateRole = await checkingUserId(userId);

      // Checking if validateRole has data or not
      // If there is no data, that means that there is no professor
      if (!validateRole[0]) {
        return res.json({
          message: `You should be a professor to change marks.`,
        });
      }

      // Check if the CourseID belongs to TeacherID
      const getCourseID = await checkCourseTeacher(enrolmentId, userId);

      console.log(getCourseID);

      if (!getCourseID[0]) {
        return res.json({
          message: "The course and student is not assigned to you",
        });
      }

      // Running the update query to change the student mark
      await changingStudentMark(mark, enrolmentId);

      res.json({ message: `Enrolment ${enrolmentId} changed sucessfully.` });
    } catch (error) {
      // If any of these requests go wront, it will return an internal error
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
};
