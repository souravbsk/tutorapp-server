const profile = require("../models/profile.model");
const path = require("path");
const fs = require("fs");

exports.findAll = (req, res) => {
  profile.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving profile.",
      });
    else res.send(data);
  });
};

exports.findOne = (req, res) => {

  profile.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found profile with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving profile with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

exports.findOneByUserId = (req, res) => {
  profile.findByUserId(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found profile with userid ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving profile with userid " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

exports.create = (req, res) => {
  // Validate request
  //console.log(req.body)
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a profile
  const newProfile = new profile({
    userid: req.body.userid,
    instituteName: req.body.instituteName || false,
    poc: req.body.poc,
    emailId: req.body.emailId,
    isEmailVarified: req.body.isEmailVarified,
    primaryContact: req.body.primaryContact,
    isContactVarified: req.body.isContactVarified,
    whatsappNumber: req.body.whatsappNumber,
    gender: req.body.gender || false,
    // interestedIn :req.body.interestedIn || false,
    instituteCategory: req.body.instituteCategory || false,
    isAgreeTnc: req.body.isAgreeTnc,
    landlineNumber: req.body.landlineNumber || false,
    alternativeNumber: req.body.alternativeNumber || false,
    address1: req.body.address1,
    address2: req.body.address2 || false,
    profileimagepath: req.body.profileimagepath || false,
  });

  // Save profile in the database
  profile.create(newProfile, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the profile.",
      });
    else res.send(data);
  });
};

exports.delete = (req, res) => {
  profile.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found profile with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete profile with id " + req.params.id,
        });
      }
    } else res.send({ message: `profile was deleted successfully!` });
  });
};

exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  profile.updateById(req.params.id, req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found profile with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating profile with id " + req.params.id,
        });
      }
    } else
      res.send({
        success: true,
        data,
      });
  });
};

exports.imageupload = (req, res) => {
  // Validate Request


  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  if (req?.body?.path) {
    const [a, imagepath] = req?.body?.path.split("\\");
    const userimagepath = `uploads/${imagepath}`;
    fs.unlink(userimagepath, (error) => {
      if (error) {
        console.error("error deleting image", error);
      } else {
      }
    });
  }

  const profileimage = req?.file?.path;

  if (!profileimage) {
    return res.status(400).json({ messege: "image required" });
  }

  const newprofile = {
    profileimagepath: profileimage,
  };

  profile.updateById(req.params.id, newprofile, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found profile with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating profile with id " + req.params.id,
        });
      }
    } else {
      res.send({
        success: true,
        data,
      });
    }
  });
};
