const sql = require("./db.js");

// constructor
const systemlistitem = function(systemlistitem) {
  this.listitemId = systemlistitem.listitemId;
  this.listid = systemlistitem.listid;
  this.listItemName = systemlistitem.listItemName;
};

systemlistitem.getAll = (result) => {
  let query = "SELECT sys.listItemId, sys.listid, sys.listItemName, sysli.listName as listName FROM systemlistitem sys inner join systemlist sysli on sys.listid = sysli.listId;";

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

systemlistitem.findById = (id, result) => {
    sql.query(`SELECT sys.listItemId, sys.listid, sys.listItemName, sysli.listName as listName FROM systemlistitem sys inner join systemlist sysli on sys.listid = sysli.listId WHERE listItemId = ${id}`, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
  
      if (res.length) {
        result(null, res[0]);
        return;
      }
  
      // not found systemlistitem with the id
      result({ kind: "not_found" }, null);
    });
  };


  systemlistitem.create = (newsystemlistitem, result) => {
   
    sql.query("INSERT INTO systemlistitem SET ?", newsystemlistitem, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, { id: res.insertId, ...newsystemlistitem });
    });
  };


  systemlistitem.updateById = (id, systemlistitem, result) => {
    sql.query(
      "UPDATE systemlistitem SET listItemName = ?,listid = ?  where listItemId = ?",
      [ systemlistitem.listItemName,systemlistitem.listid,id],
      (err, res) => {
        if (err) {
        
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found systemlistitem with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
   
        result(null, { id: id, ...systemlistitem });
      }
    );
  };


  systemlistitem.remove = (id, result) => {
    sql.query("DELETE FROM systemlistitem WHERE listItemId = ?", id, (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found systemlistitem with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      result(null, res);
    });
  };






module.exports = systemlistitem;