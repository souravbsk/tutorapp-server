const systemlist = require("../models/systemlist.model.js");

exports.findAll = (req, res) => {
  
    systemlist.getAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving systemlist."
        });
      else res.send(data);
    });
  };

 // Find a single systemlist by Id
exports.findOne = (req, res) => {
  systemlist.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found systemlist with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving systemlist with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

  exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }

    // Create a systemlist
    const newSystemlist = new systemlist({
      listName: req.body.listName || false
    });

    // Save systemlist in the database
    systemlist.create(newSystemlist, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the systemlist."
        });
      else res.send(data);
    });
  };


  exports.update = (req, res) => {

    systemlist.updateById(
      req.params.id,
      new systemlist(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found systemlist with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating systemlist with id " + req.params.id
            });
          }
        } else res.send(data);
      }
    );
  };

  exports.delete = (req, res) => {
    systemlist.remove(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found systemlist with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete systemlist with id " + req.params.id
          });
        }
      } else res.send({ message: `systemlist was deleted successfully!` });
    });
  };