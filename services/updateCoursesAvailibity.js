//Export the end point
module.exports = (app, databaseConnect) => {
  //Pass the app.put method from express
  app.put("/courses/:courseId", (req, res) => {
    const { courseId } = req.params;
    const { isAvailable } = req.body;

    const query = `UPDATE courses SET isAvailable = ? WHERE CourseID = ?`;
    // Run the query and return error or success messgae
    databaseConnect.query(query, [isAvailable, courseId], (err) => {
      if (err) {
        console.error("Error updating column data:", err);
        res.status(500).json({ error: "Failed to update column data" });
        return;
      }
      return res.json({ message: "Column data updated successfully" });
    });
  });
};
