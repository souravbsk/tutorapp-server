const subject = require("../models/subject.model.js");

// Create and Save a new subject
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a subject
  const newSubject = new subject({
    name: req.body.name,
    // subjectId: req.body.subjectId,
    segmentId: req.body.segmentId || false,
  });

  // Save subject in the database
  subject.create(newSubject, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the subject.",
      });
    else res.send(data);
  });
};

exports.findOne = (req, res) => {
  subject.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found subject with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving subject with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

exports.findAll = (req, res) => {
  subject.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving subject.",
      });
    else res.send(data);
  });
};






exports.findSubjectBySegmentId = (req, res) => {
  subject.getSubjectBySegmentId(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Subject with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Subject with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};







exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const segmentId = req.body.segmentid;

  const updatedSubject = new subject({
    name: req.body.name,
    segmentId: segmentId,
  });

  
  subject.updateById(req.params.id, updatedSubject, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found subject with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating subject with id " + req.params.id,
        });
      }
    } else {
      res.send(data);
    }
  });
};

exports.delete = (req, res) => {
  subject.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found subject with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete subject with id " + req.params.id,
        });
      }
    } else res.send({ message: `subject was deleted successfully!` });
  });
};
