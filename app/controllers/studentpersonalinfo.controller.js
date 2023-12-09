const studentpersonalinfo = require("../models/studentpersonalinfo.model")

exports.findOne = (req, res) => {
  studentpersonalinfo.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found users with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving users with id " + req.params.id,
        });
      }
    } else res.send({
      success:true,
      data
    });
  });
};


exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    // Create a studentpersonalinfo
    const newStudentpersonalinfo = ({
      userid  :req.body.userid ,
      relationwithstudent :req.body.relationwithstudent,
      dateofbirth :req.body.dateofbirth,
      studyingin :req.body.studyingin,
      board :req.body.board,
      institutename :req.body.institutename,
      institutelocation :req.body.institutelocation
      
    });
  
    // Save Users in the database
    studentpersonalinfo.create(newStudentpersonalinfo, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the studentpersonalinfo."
        });
      else res.send({
        success:true,
        data
      });
    });
  };


  exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    studentpersonalinfo.updateById( req.params.id, (req.body), (err, data) => {
  
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found studentpersonalinfo with userid ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating studentpersonalinfo with userid " + req.params.id
            });
          }
        } else res.send({
          success:true,
          data
        });
      }
    );
  };