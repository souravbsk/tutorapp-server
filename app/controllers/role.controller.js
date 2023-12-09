const role = require("../models/role.model")

// Retrieve all role from the database (with condition).
exports.findAll = (req, res) => {
  
    role.getAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving role."
        });
      else res.send(data);
    });
  };