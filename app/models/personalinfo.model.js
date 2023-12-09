const sql = require("./db.js");

// constructor
const personalinfo = function (personalinfo) {
  this.userid = personalinfo.userid;
  this.maritalstatus = personalinfo.maritalstatus;
  this.Vechiclesowend = personalinfo.Vechiclesowend;
  this.yourprivacy = personalinfo.yourprivacy;
  this.facebookLink = personalinfo.facebookLink;
  this.tweeterLink = personalinfo.tweeterLink;
  this.linkedinLink = personalinfo.linkedinLink;
  this.googleLink = personalinfo.googleLink;
  this.dateofbirth = personalinfo.dateofbirth;
};

personalinfo.create = (newpersonalinfo, result) => {
  sql.query("INSERT INTO personalinfo SET ?", newpersonalinfo, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newpersonalinfo });
  });
};

personalinfo.findByUserId = (id, result) => {
  sql.query(
    `SELECT *, sm.listItemName AS Marital, sv.listItemName AS Vehicle, sp.listItemName AS Privacy FROM personalinfo per INNER JOIN systemlistitem sm ON per.maritalstatus = sm.listItemId INNER JOIN systemlistitem sv ON per.Vechiclesowend = sv.listItemId INNER JOIN systemlistitem sp ON per.yourprivacy = sp.listItemId WHERE per.userid =${id} `,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.length) {
        result(null, res[0]);
        return;
      }
      // not found personalinfo with the userid
      result({ kind: "not_found" }, null);
    }
  );
};

personalinfo.updateByUserId = (id, newPersonalInfo, result) => {
  sql.query(
    "UPDATE personalinfo SET ? where userid = ?",
    [newPersonalInfo, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        // not found personalinfo with the userid
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, { id: id, ...newPersonalInfo });
    }
  );
};

module.exports = personalinfo;
