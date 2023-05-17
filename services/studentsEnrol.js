//Export the end point
module.exports = (app, databaseConnect) => {
  //Pass the app.put method from express
  app.post("/students-enrol", (req, res) => {
    const { courseId, userId } = req.body;

    // MySQL INSET command: The condition "NOT EXISTS" ensure the
    // same student does select the same course more than once
    const query = `
        INSERT INTO enrolments (CourseID, UserID)
        SELECT ?, ? FROM DUAL
        WHERE NOT EXISTS (
          SELECT enrolments.CourseID, courses.CourseID, courses.isAvailable 
          FROM enrolments 
          INNER JOIN courses ON (enrolments.CourseID = courses.CourseID)
          WHERE enrolments.CourseID = ? and enrolments.UserID = ?);
      `;
    // Run the query and return error or success messgae
    databaseConnect.query(
      query,
      [courseId, userId, courseId, userId],
      function (err, result) {
        if (err)
          return res
            .status(500)
            .json({ error: "Courese enrolment was not successful." });

        // Check weather the number of affecteRows is zero: i.e.,
        // the INSERT has been ignored due since the same course has been taken by the same student
        // Notify the same course has already been selected by the same student!
        if (result.affectedRows == "0")
          return res.json({ message: "Please, select a different course." });

        // Returning the final result with the updated records
        return res.json({
          message: result.affectedRows + " record(s) updated successfully",
        });
      }
    );
  });
};
