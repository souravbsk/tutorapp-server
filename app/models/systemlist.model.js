const sql = require("./db.js");

// constructor
const systemlist = function(systemlist) {
    this.listid = systemlist.listid;
    this.listName = systemlist.listName;

  };

systemlist.getAll = (result) => {
    let query = "SELECT * FROM systemlist";
  
    sql.query(query, (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
  
      result(null, res);
    });
  };

  systemlist.findById = (id, result) => {
    sql.query(`SELECT * FROM systemlist WHERE listId = ${id}`, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
  
      if (res.length) {
        result(null, res[0]);
        return;
      }
  
      // not found systemlist with the id
      result({ kind: "not_found" }, null);
    });
  };


  systemlist.create = (newsystemlist, result) => {
    sql.query("INSERT INTO systemlist SET ?", newsystemlist, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      result(null, { id: res.insertId, ...newsystemlist });
    });
  };

  systemlist.updateById = (id, systemlist, result) => {
    sql.query(
      "UPDATE systemlist SET listName = ?  where listId = ?",
      [systemlist.listName, id ],
      (err, res) => {
        if (err) {
          result(null, err);
          return;
        }

        if (res.affectedRows == 0) {
          // not found systemlist with the id
          result({ kind: "not_found" }, null);
          return;
        }

        result(null, { id: id, ...systemlist });
      }
    );
  };

  systemlist.remove = (id, result) => {
    sql.query("DELETE FROM systemlist WHERE listId = ?", id, (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found systemlist with the id
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, res);
    });
  };


module.exports = systemlist;