const teacherproficiency = require("../models/teacherproficiency.model");

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a teacherproficiency
  const newTeacherproficiency = new teacherproficiency({
    userid: req.body.userid,
    hasteachingexp: req.body.hasteachingexp,
    universityname: req.body.universityname || false,
    location: req.body.location || false,
    serviceperiod: req.body.serviceperiod || false,
    trainingapproach: req.body.trainingapproach || false,
    expinyear: req.body.expinyear || false,
  });

  // Save teacherproficiency in the database
  teacherproficiency.create(newTeacherproficiency, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the teacherproficiency.",
      });
    else res.send(data);
  });
};

exports.findOne = (req, res) => {
  const teachingLocationId = req.query?.locationId;
  teacherproficiency.findById(
    req.params.id,
    teachingLocationId,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          return res.status(404).send({
            message: `Not found teacherproficiency with userid ${req.params.id}.`,
          });
        } else {
          return res.status(500).send({
            message:
              "Error retrieving teacherproficiency with userid " +
              req.params.id,
          });
        }
      }

      if (data) {
        return res.send(data);
      }
    }
  );
};

exports.updateTeacherProfeciencyByuserId = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  teacherproficiency.updateByUserId(req.params.id, req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found teacherproficiency with userid ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message:
            "Error updating teacherproficiency with userid " + req.params.id,
        });
      }
    } else res.send(data);
  });
};
