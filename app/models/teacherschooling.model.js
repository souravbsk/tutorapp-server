const sql = require("./db.js");

// Constructor
const teacherschooling = function (teacherschooling) {
  this.userId = teacherschooling.userId;
  this.level = teacherschooling.level;
  this.board = teacherschooling.board;
  this.schoolName = teacherschooling.schoolName;
  this.schoolAddress = teacherschooling.schoolAddress;
  this.passingYear = teacherschooling.passingYear;
};

// Create a new teacherschooling record
teacherschooling.create = (newTeacherschooling, result) => {
  sql.query(
    "INSERT INTO teacherschooling SET ?",
    newTeacherschooling,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      result(null, { id: res.insertId, ...newTeacherschooling });
    }
  );
};

teacherschooling.findById = (id, languageId, result) => {
  // teacher schooling data
  sql.query(
    `SELECT *, sli.listItemName AS board_Name FROM teacherschooling AS ts INNER JOIN systemlistitem AS sli ON ts.board = sli.listItemId WHERE ts.userid = ${id}`,
    (err, res1) => {
      if (err) {
        result(err, null);
        return;
      }
      

      // teacher  qualification data
      sql.query(
        `SELECT te.educationid, te.userid, te.level,te.specialization, te.InstitutionName, te.university, te.mediumofInstruction, te.coursetype, te.InstitutionAddress, sli.listItemName AS level_Name, sli2.listItemName AS specialization_Name, sli3.listItemName AS institutionName_Name, sli4.listItemName AS university_Name, sli5.listItemName AS mediumofInstruction_Name, sli6.listItemName AS coursetype_Name FROM teachereducation AS te INNER JOIN systemlistitem AS sli ON te.level = sli.listItemId INNER JOIN systemlistitem AS sli2 ON te.specialization = sli2.listItemId INNER JOIN systemlistitem AS sli3 ON te.InstitutionName = sli3.listItemId INNER JOIN systemlistitem AS sli4 ON te.university = sli4.listItemId INNER JOIN systemlistitem AS sli5 ON te.mediumofInstruction = sli5.listItemId INNER JOIN systemlistitem AS sli6 ON te.coursetype = sli6.listItemId WHERE te.userid = ${id}`,
        (err, res2) => {
          if (err) {
            result(err, null);
            return;
          }
          // teacher language data

          sql.query(
            `SELECT sld.id, sld.userid, sld.listitemid, sld.listid, sli.listItemName FROM systemlistdata sld INNER JOIN systemlistitem sli ON sld.listitemid = sli.listItemId WHERE sld.userid = ${id} AND sld.listid = ${languageId}`,
            (err, res3) => {
              if (err) {
                result(err, null);
                return;
              }
              if (res1.length || res2.length || res3.length) {
                const resultObject = {
                  schoolingData: res1,
                  languageData: res3.map((item) => ({
                    ...item,
                    dbstatus: "n",
                  })),
                  educationData: res2.map((item) => ({
                    ...item,
                    dbstatus: "n",
                  })), // Add dbstatus to each item in educationData
                };
                result(null, resultObject);
              } else {
                // Not found users with the id
                result({ kind: "not_found" }, null);
              }
            }
          );
        }
      );
    }
  );
};

teacherschooling.updateBySchoolingId = (updateData, result) => {
  const { schoolingId, board, schoolName, schoolAddress, passingYear } =
    updateData;

  sql.query(
    "UPDATE teacherschooling SET board = ?, schoolName = ?, schoolAddress = ?, passingYear = ? WHERE schoolingId = ?",
    [board, schoolName, schoolAddress, passingYear, schoolingId],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.affectedRows == 0) {
        // If no rows were affected, it means no record was found with the given `schoolingId`.
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, { ...updateData });
    }
  );
};

module.exports = teacherschooling;
