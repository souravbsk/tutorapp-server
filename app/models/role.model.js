const sql = require("./db.js");

// constructor
const role = function(role) {
    this.name = role.name;
  };

  role.getAll = (result) => {
    let query = "SELECT * FROM role";

    sql.query(query, (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
  
      result(null, res);
    });
  };



  module.exports = role;