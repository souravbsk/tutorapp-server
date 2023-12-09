const sql = require("./db.js");

// constructor
const systemlistdata = function (systemlistdata) {
  this.userid = systemlistdata.userid;
  this.listitemid = systemlistdata.listitemid;
  this.listid = systemlistdata.listid;
};

systemlistdata.create = (newsystemlistdata, result) => {
  sql.query(
    "INSERT INTO systemlistdata SET ?",
    newsystemlistdata,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, { id: res.insertId, ...newsystemlistdata });
    }
  );
};

systemlistdata.getAll = (id, result) => {
  let query = `SELECT userid, sa.listName AS category, sb.listItemName AS catgory_value FROM systemlistdata sys INNER JOIN systemlist sa ON sys.listid = sa.listId INNER JOIN systemlistitem sb ON sys.listitemid = sb.listItemId WHERE sys.userid =${id}  `;
  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};

systemlistdata.remove = (userId, listid, result) => {
  sql.query(
    "DELETE FROM systemlistdata WHERE userid = ? and listid = ?",
    [userId, listid],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        // not found users with the id
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, res);
    }
  );
};

module.exports = systemlistdata;
