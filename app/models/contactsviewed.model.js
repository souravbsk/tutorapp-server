const sql = require("./db");

const contactsviewed = function (contactsviewed) {
  this.userid = contactsviewed.userid;
  this.viewedusers = contactsviewed.viewedusers;
};

contactsviewed.findById = (id, result) => {
  sql.query(`select viewedusers from contactsviewed WHERE userid =${id}`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length) {
      result(null, res);
      return;
    }
    // not found users with the id
    result({ kind: "not_found" }, null);
  });
};




contactsviewed.create = (newData, result) => {

  const query = `INSERT INTO contactsviewed (userid, viewedusers)
  VALUES (${newData.userid}, ${newData.viewedusers})
  ON DUPLICATE KEY UPDATE viewedusers = VALUES(viewedusers);`

  sql.query(query, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res) {
      const resObject = {
        id: res.insertId,
        ...newData,
        success: res.protocol41,
      };
      result(null, resObject);
    }
  });
};

module.exports = contactsviewed;
