const sql = require("./db.js");

// constructor
const category = function(category) {
    this.name = category.name;
  };

  category.getAll = (result) => {
    let query = "SELECT * FROM category";

    sql.query(query, (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
  
      result(null, res);
    });
  };



  module.exports = category;