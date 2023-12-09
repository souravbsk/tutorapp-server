const userreviews = require("../models/userreviews.model");

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const newUserreviews = new userreviews({
    userid: req.body.userid,
    ratingsvalue: req.body.ratingsvalue,
    reviewtext: req.body.reviewtext,
    revieweduserid: req.body.revieweduserid,
    status: req.body.status,
  });

  userreviews.createOrUpdate(newUserreviews, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating or updating the userreviews.",
      });
    else res.send(data);
  });
};

exports.findAll = (req, res) => {
  console.log(req.params.userid);
  userreviews.getAll(req.params.userid,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving userreviews.",
      });
    else res.send({success:true,data});
  });
};
