const contactsviewed = require("../models/contactsviewed.model");

exports.findOne = (req, res) => {
  contactsviewed.findById(req.params.id, (err, data) => {
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
    } else res.send(data);
  });
};

exports.create = (req, res) => {
 
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const newData = {
    userid: req.body.userid,
    viewedusers: req.body.viewedusers
  }
  

  // Save contactsviewed in the database
  contactsviewed.create(newData, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the contactsviewed.",
      });
    else {
      res.send(data)
    }
  });
};
