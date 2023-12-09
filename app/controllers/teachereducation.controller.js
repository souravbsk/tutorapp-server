const teachereducation = require("../models/teachereducation.model");

exports.create = (req, res) => {
  // Validate request
  if (!req.body || !Array.isArray(req.body)) {
    res.status(400).send({
      message: "Request body must be an array of teachereducation data.",
    });
    return;
  }

  const teachereducationData = req.body;

  // Create an array to store the results of the insertions
  const insertionResults = [];

  // Iterate through the array and insert each teachereducation object
  for (const data of teachereducationData) {
    const newTeachereducation = new teachereducation({
      userid: data.userid,
      level: data.level,
      specialization: data.specialization,
      InstitutionName: data.InstitutionName,
      InstitutionAddress: data.InstitutionAddress,
      university: data.university,
      mediumofInstruction: data.mediumofInstruction,
      coursetype: data.coursetype,
    });

    // Save teachereducation in the database
    teachereducation.create(newTeachereducation, (err, result) => {
      if (err) {
        insertionResults.push({ error: err.message });
      } else {
        insertionResults.push(result);
      }

      // Check if all insertions are completed
      if (insertionResults.length === teachereducationData.length) {
        // Check if any insertions resulted in an error
        const hasError = insertionResults.some((item) => item.error);
        if (hasError) {
          res.status(500).send({
            message: "Some error occurred while creating teachereducation.",
            errors: insertionResults,
          });
        } else {
          res.send({
            success: true,
            status: 200,
            message: "Teachereducation data inserted successfully.",
            results: insertionResults,
          });
        }
      }
    });
  }
};

exports.delete = (req, res) => {
  teachereducation.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found teachereducation with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete teachereducation with id " + req.params.id,
        });
      }
    } else res.send({ message: `teachereducation was deleted successfully!` });
  });
};

exports.updateOrInsert = async (req, res) => {
  const educationData = req.body;

  let updateResults = [];

  for (const data of educationData) {
    const dbstatus = data.dbstatus; // Get the dbstatus from the request data

    if (dbstatus === "i") {
      // If dbstatus is 'i', insert a new record
      const insertData = {
        userid: data.userid,
        level: data.level,
        specialization: data.specialization,
        InstitutionName: data.InstitutionName,
        InstitutionAddress: data.InstitutionAddress,
        university: data.university,
        mediumofInstruction: data.mediumofInstruction,
        coursetype: data.coursetype,
      };

      await new Promise((resolve, reject) => {
        teachereducation.create(insertData, (err, result) => {
          if (err) {
            reject(err);
          } else {
            updateResults.push(result);
            resolve();
          }
        });
      });
    } else if (dbstatus === "u") {
      // If dbstatus is 'u', update the record based on educationid
      const updateData = {
        educationid: data.educationid,
        level: data.level,
        specialization: data.specialization,
        InstitutionName: data.InstitutionName,
        InstitutionAddress: data.InstitutionAddress,
        university: data.university,
        mediumofInstruction: data.mediumofInstruction,
        coursetype: data.coursetype,
      };

      await new Promise((resolve, reject) => {
        teachereducation.updateByEducationId(updateData, (err, result) => {
          if (err) {
            reject(err);
          } else {
            updateResults.push(result);
            resolve();
          }
        });
      });
    } else if (dbstatus === "d") {
      // If dbstatus is 'd', delete the record based on educationid
      const educationId = data.educationid;

      await new Promise((resolve, reject) => {
        teachereducation.remove(educationId, (err, result) => {
          if (err) {
            reject(err);
          } else {
            updateResults.push(result);
            resolve();
          }
        });
      });
    }
  }

  const filteredData = educationData.filter((data) => data.dbstatus !== "n");

  // Check if all promises were resolved successfully
  if (updateResults.length === filteredData.length) {

    // All operations completed successfully
    res.status(200).send({
      message: "Operations completed successfully",
      results: updateResults,
    });
  } else {
    // Some operations failed
    res
      .status(500)
      .send({ message: "Some operations failed", results: updateResults });
  }
};
