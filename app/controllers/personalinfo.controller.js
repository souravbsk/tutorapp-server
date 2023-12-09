const personalinfo = require("../models/personalinfo.model")

exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    // Create a personalinfo
    const newPersonalInfo = ({
      userid  :req.body.userid ,
      maritalstatus :req.body.maritalstatus,
      Vechiclesowend :req.body.Vechiclesowend,
      yourprivacy :req.body.yourprivacy,
      facebookLink :req.body.facebookLink,
      tweeterLink :req.body.tweeterLink,
      linkedinLink :req.body.linkedinLink,
      googleLink :req.body.googleLink ,
      dateofbirth :req.body.dateofbirth || false
      
    });
  
    // Save Users in the database
    personalinfo.create(newPersonalInfo, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the personalinfo."
        });
      else res.send({
        success:true,
        data
      });
    });
  };


  exports.findOneByUserId = (req, res) => {
    personalinfo.findByUserId(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found personalinfo with userid ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving personalinfo with userid " + req.params.id
          });
        }
      } else res.send(data);
    });
  };


  exports.updatePersonalInfoByUserId = (req, res) => {
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
    }
  
    personalinfo.updateByUserId(req.params.id, (req.body), (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found personalinfo with userid ${req.params.id}.`,
            });
          } else {
            res.status(500).send({
              message: "Error updating personalinfo with userid " + req.params.id,
            });
          }
        } else res.send(data);
      }
    );
  };