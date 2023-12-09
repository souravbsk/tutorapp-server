const systemlistitem = require("../models/systemlistitem.model.js");

exports.findAll = (req, res) => {
  
  systemlistitem.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving systemlistitem."
      });
    else res.send(data);
  });
};


exports.findOne = (req, res) => {
    systemlistitem.findById(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found systemlistitem with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving systemlistitem with id " + req.params.id
          });
        }
      } else res.send(data);
    });
  };


  exports.create = (req, res) => {

    // Create a systemlistitem
    const Systemlistitem = new systemlistitem({
      listid: req.body.listid,
      listItemName: req.body.listItemName || false
    });
  
    // Save systemlistitem in the database
    systemlistitem.create(Systemlistitem, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the systemlistitem."
        });
      else res.send(data);
    });
  };


  exports.update = (req, res) => {
  
    systemlistitem.updateById(
      req.params.id,
      new systemlistitem(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found systemlistitem with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating systemlistitem with id " + req.params.id
            });
          }
        } else res.send(data);
      }
    );
  };


  exports.delete = (req, res) => {
    systemlistitem.remove(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found systemlistitem with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete systemlistitem with id " + req.params.id
          });
        }
      } else res.send({ message: `systemlistitem was deleted successfully!` });
    });
  };