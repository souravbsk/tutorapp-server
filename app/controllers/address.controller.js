const address = require("../models/address.model");

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create an array to hold the addresses
  const addressesToInsert = [];

  // Loop through the request body and create address objects
  req.body.forEach((item) => {
    const newAddress = {
      userid: item.userid,
      addressline1: item.addressline1 || false,
      addressline2: item.addressline2 || false,
      landmark: item.landmark || false,
      city: item.city || false,
      state: item.state || false,
      country: item.country || false,
      pin: item.pin || false,
      addressType: item.addressType || false,
      isSameAddress: item.isSameAddress || "N", // Ensure a default value for isSameAddress
    };
    addressesToInsert.push(newAddress);
  });

  // Save address in the database
  address.create(addressesToInsert, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the address.",
      });
    else
      res.send({
        success: true,
        data,
      });
  });
};

exports.findOne = (req, res) => {
  address.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found address with userid ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving address with userid " + req.params.id,
        });
      }
    } else
      res.send({
        success: true,
        data,
      });
  });
};

exports.updateAddressByUserId = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  address.updateByUserId(req.params.id, req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found address with userid ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating address with userid " + req.params.id,
        });
      }
    } else
      res.send({
        success: true,
        data,
      });
  });
};

exports.delete = (req, res) => {
  address.remove(req.params.userid, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `Not found address with id ${req.params.userid}.`,
          success: true,
        });
      } else {
        res.status(500).send({
          message: "Could not delete address with id " + req.params.userid,
        });
      }
    } else
      res.send({
        success: true,
        message: `subject was deleted successfully!`,
        data,
      });
  });
};
