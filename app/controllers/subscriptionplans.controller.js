const subscriptionplans = require("../models/subscriptionplans.model");

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const newSubscriptionplans = new subscriptionplans({
    planname: req.body.planname,
    description: req.body.description,
    planperiod: req.body.planperiod,
    planterm: req.body.planterm || false,
    amount: req.body.amount,
    plantype: req.body.plantypes,
    status: req.body.status,
  });

  // Save Subscriptionplans in the database
  subscriptionplans.create(newSubscriptionplans, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the subscriptionplans.",
      });
    else res.send(data);
  });
};

exports.findAll = (req, res) => {
  subscriptionplans.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving subscriptionplans.",
      });
    else res.send(data);
  });
};

exports.findAllByStatus = (req, res) => {
  const plantype1 = req.query.type1
  const plantype2 = req.query.type2
  const plantype3 = req.query.type3
  const plantype4 = req.query.type4



  subscriptionplans.getAllByStatus(plantype1,plantype2,plantype3,plantype4,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving subscriptionplans.",
      });
    else res.send(data);
  });
};

exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  subscriptionplans.updateByPlanId(req.params.id, req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found subscriptionplans with planid ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message:
            "Error updating subscriptionplans with planid " + req.params.id,
        });
      }
    } else
      res.send({
        success: true,
        data,
      });
  });
};

// Delete a users with the specified id in the request
exports.delete = (req, res) => {
  subscriptionplans.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found subscription plans with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message:
            "Could not delete subscription plans with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};
