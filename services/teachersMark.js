//Export the end point
module.exports = (app, databaseConnect) => {
  //Pass the app.put method from express and defining route
  app.put("/enrolment/:enrolmentId", (req, res) => {
    const { enrolmentId } = req.params;
    const { mark } = req.body;

    const teste = `S`;

    // Run the query and return error or success messgae
    const query = `UPDATE enrolments SET Mark = ? WHERE EnrolmentID = ?`;

    databaseConnect.query(query, [mark, enrolmentId], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to update column data" });
      }
      return res.json({ message: "It is working" });
    });
  });
};
