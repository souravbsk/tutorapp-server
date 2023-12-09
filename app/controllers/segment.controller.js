const segment = require("../models/segment.model.js");

exports.findAll = (req, res) => {
  segment.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving segment.",
      });
    else res.send(data);
  });
};

// Create and Save a new segment
exports.create = (req, res) => {
  
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a segment
  const newSegment = new segment({
    name: req.body.name,
    categoryid: req.body.categoryid || false,
  });

  // Save segment in the database
  segment.create(newSegment, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the segment.",
      });
    else res.send(data);
  });
};

// Find a single segment by Id
exports.findOne = (req, res) => {
  segment.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found segment with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving segment with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

exports.findsegmentByCategoryId = (req, res) => {
  segment.getSegmentsBycategoryId(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found segment with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving segment with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

exports.updateSegmentBySegmentId = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  segment.updateSegmentBySegmentId(
    req.params.id,
    new segment(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found segment with id ${req.params.id}.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating segment with id " + req.params.id,
          });
        }
      } else res.send(data);
    }
  );
};

exports.delete = (req, res) => {
  segment.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found segment with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete segment with id " + req.params.id,
        });
      }
    } else res.send({ message: `segment was deleted successfully!` });
  });
};
