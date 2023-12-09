const category = require("../models/category.model")

// Retrieve all Tutorials from the database (with condition).
exports.findAll = (req, res) => {
  
    category.getAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
      else res.send(data);
    });
  };