const teacherschooling = require("../models/teacherschooling.model");

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  const teacherschoolingData = req.body;

  const insertionResults = [];

  for (const data of teacherschoolingData) {
    const newTeacherschooling = new teacherschooling({
      userId: data.userId,
      level: data.level,
      board: data.board,
      schoolName: data.schoolName,
      schoolAddress: data.schoolAddress,
      passingYear: data.passingYear,
    });

    // Create a new teacherschooling record

    teacherschooling.create(newTeacherschooling, (err, result) => {
      if (err) {
        insertionResults.push({ error: err.message });
      } else {
        insertionResults.push(result);
      }

      // Check if all insertions are completed
      if (insertionResults.length === teacherschoolingData.length) {
        // Check if any insertions resulted in an error
        const hasError = insertionResults.some((item) => item.error);
        if (hasError) {
          res.status(500).send({
            message: "Some error occurred while creating teacherSchooling.",
            errors: insertionResults,
          });
        } else {
          res.send({
            success: true,
            status: 200,
            message: "teacherSchooling data inserted successfully.",
            results: insertionResults,
          });
        }
      }
    });
  }
};

exports.findOne = (req, res) => {
  teacherschooling.findById(req.params.id, req.query.languageId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found schooling with userid ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message:
            "Error retrieving teacher schooling with userid " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  const updatedData = req.body;

  // Use a Promise or async/await to handle multiple updates
  const updatePromises = updatedData.map((updateObject) => {
    return new Promise((resolve, reject) => {
      teacherschooling.updateBySchoolingId(updateObject, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            reject({
              message: `Not found users with id .`,
            });
          } else {
            reject({
              message: "Error updating users with id ",
            });
          }
        } else {
          resolve(data);
        }
      });
    });
  });

  // Wait for all updates to complete before responding
  Promise.all(updatePromises)
    .then((results) => {
      res.send({
        success: true,
        data: results,
      });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};
