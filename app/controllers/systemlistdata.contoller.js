const systemlistdata = require("../models/systemlistdata.model");

exports.create = (req, res) => {
  // Validate request
  if (
    !req.body ||
    !req.body.listitemid ||
    !Array.isArray(req.body.listitemid) ||
    req.body.listitemid.length === 0
  ) {
    res.status(400).send({
      message:
        "Content can not be empty, and listitemid must be a non-empty array!",
    });
    return;
  }

  // Initialize an array to store the inserted data
  const insertedData = [];

  // Loop through the listitemid array and insert each item
  for (const item of req.body.listitemid) {
    const newSystemlistdata = new systemlistdata({
      userid: req.body.userid,
      listitemid: item,
      listid: req.body.listid || false,
    });

    systemlistdata.create(newSystemlistdata, (err, data) => {
      
      if (err) {
        console.error(
          `Error inserting item with listitemid ${item}: ${err.message}`
        );
      } else {
        insertedData.push(data);
      }

      if (insertedData.length === req.body.listitemid.length) {
        res.send(insertedData);
      }
    });
  }
};

exports.findAll = (req, res) => {
  systemlistdata.getAll(req.params.id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving systemlistdata.",
      });
    else res.send(data);
  });
};

exports.delete = (req, res) => {
 
  systemlistdata.remove(req.params.userid, req.params.listid, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found users with userid ${req.params.userid}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete users with userid " + req.params.userid,
        });
      }
    } else {
     
      if (data?.affectedRows > 0) {
        res.send({
          success: true,
          message: `users data deleted successfully!`,
        });
      } else {
        res.send({
          success: true,
          message: `users data deleted successfully!`,
        });
      }
    }
  });
};
