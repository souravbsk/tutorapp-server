const sql = require("./db.js");

// constructor
const teacherproficiency = function (teacherproficiency) {
  this.userid = teacherproficiency.userid;
  this.hasteachingexp = teacherproficiency.hasteachingexp;
  this.universityname = teacherproficiency.universityname;
  this.location = teacherproficiency.location;
  this.serviceperiod = teacherproficiency.serviceperiod;
  this.trainingapproach = teacherproficiency.trainingapproach;
  this.expinyear = teacherproficiency.expinyear;
};

teacherproficiency.create = (newteacherproficiency, result) => {
  sql.query(
    "INSERT INTO teacherproficiency SET ?",
    newteacherproficiency,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      result(null, { id: res.insertId, ...newteacherproficiency });
    }
  );
};

teacherproficiency.findById = (id, teachingLocationId, result) => {
  sql.query(
    `SELECT id,userid,universityname AS universitynameId, serviceperiod AS serviceperiodId, expinyear as expinyearid, hasteachingexp,location,trainingapproach, su.listItemName AS university, sp.listItemName AS service_period, se.listItemName AS experience FROM teacherproficiency AS te INNER JOIN systemlistitem AS su ON te.universityname = su.listItemId INNER JOIN systemlistitem AS sp ON te.serviceperiod = sp.listItemId INNER JOIN systemlistitem AS se ON te.expinyear = se.listItemId WHERE te.userid = ${id}`,
    (err, res) => {
      if (err) {
        return result(err, null);
      }

      sql.query(
        `SELECT sld.id, sld.userid, sld.listitemid, sld.listid, sli.listItemName FROM systemlistdata sld INNER JOIN systemlistitem sli ON sld.listitemid = sli.listItemId WHERE sld.userid = ${id} AND sld.listid = ${teachingLocationId}`,
        (err, res2) => {
          if (err) {
            return result(err, null);
          }

          if (res.length || res2.length) {
            const proficiencyData = {
              teacherInfo: res[0],
              location: {
                teachingLocation: res2,
                locationDefaultData: res2?.map(
                  (location) => location.listitemid
                ),
              },
            };
            return result(null, proficiencyData);
          } else {
            // not found teacherproficiency with the userid
            return result({ kind: "not_found" }, null);
          }
        }
      );
    }
  );
};

teacherproficiency.updateByUserId = (id, newTeacherproficiency, result) => {
  sql.query(
    "UPDATE teacherproficiency SET ? where userid = ?",
    [newTeacherproficiency, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        // not found teacherproficiency with the userid
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, { id: id, ...newTeacherproficiency });
    }
  );
};

module.exports = teacherproficiency;
