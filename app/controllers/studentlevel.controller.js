const studentlevel = require("../models/studentlevel.model");

exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const newStudentlevel = {
    userid: req.body.userid,
    segmentid: req.body.segmentid,
    locationid: req.body.locationid,
    instructionmedium: req.body.instructionmedium,
    studentsgroup: req.body.studentsgroup,
    sessionsperweek: req.body.sessionsperweek,
    budget: req.body.budget,
    privacyid: req.body.privacyid,
    bestcalltime: req.body.bestcalltime,
    requirementdesc: req.body.requirementdesc,
    gender: req.body.gender,
    maritalstatus: req.body.maritalstatus,
    agegroup: req.body.agegroup,
    schoolingpref: req.body.schoolingpref,
  };

  // Save studentlevel in the database
  studentlevel.create(newStudentlevel, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the newStudentlevel.",
      });
    else
      res.send({
        success: true,
        data,
      });
  });
};

// Find a single studentlevel by userId
exports.findOne = (req, res) => {
  studentlevel.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found studentlevel with userid ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving studentlevel with userid " + req.params.id,
        });
      }
    } else
      res.send({
        success: true,
        data,
      });
  });
};

// Find a single studentlevel by userId
exports.findAllById = (req, res) => {
  studentlevel.findAllById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found studentlevel with userid ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving studentlevel with userid " + req.params.id,
        });
      }
    } else
      res.send({
        success: true,
        data,
      });
  });
};

exports.updateStudentlevelByUserId = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  studentlevel.updatebyUserId(req.params.id, req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found studentlevel with userid ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating studentlevel with userid " + req.params.id,
        });
      }
    } else
      res.send({
        success: true,
        data,
      });
  });
};

exports.findAll = (req, res) => {
  const userid = req.query.user;

  studentlevel.getAll(userid, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    else res.send(data);
  });
};

// Find a single studentlevel by userId
exports.findStudentid = (req, res) => {
  studentlevel.getstudentlevelid(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found studentlevel with userid ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving studentlevel with userid " + req.params.id,
        });
      }
    } else
      res.send({
        success: true,
        data,
      });
  });
};
