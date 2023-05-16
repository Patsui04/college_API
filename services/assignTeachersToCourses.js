//Export the end point
module.exports = (app, databaseConnect) => {
  //Pass the app.put method from express
  app.put("/teacher/:courseId", (req, res) => {
    const { courseId } = req.params;
    const { teacherId } = req.body;

    const query = `UPDATE courses SET TeacherID = ? WHERE CourseID = ?`;
    // Run the query and return error or success messgae
    databaseConnect.query(query, [teacherId, courseId], (err) => {
      if (err) {
        console.error("Error updating column data:", err);
        res.status(500).json({ error: "Failed to update column data" });
        return;
      }
      return res.json({ message: "Column data updated successfully" });
    });
  });
};
