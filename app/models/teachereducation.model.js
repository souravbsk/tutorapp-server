const sql = require("./db.js");

// constructor
const teachereducation = function (teachereducation) {
  this.userid = teachereducation.userid;
  this.level = teachereducation.level;
  this.specialization = teachereducation.specialization;
  this.InstitutionName = teachereducation.InstitutionName;
  this.InstitutionAddress = teachereducation.InstitutionAddress;
  this.university = teachereducation.university;
  this.mediumofInstruction = teachereducation.mediumofInstruction;
  this.coursetype = teachereducation.coursetype;
};

teachereducation.create = (newteachereducation, result) => {
  sql.query(
    "INSERT INTO teachereducation SET ?",
    newteachereducation,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      result(null, { id: res.insertId, ...newteachereducation });
    }
  );
};

teachereducation.remove = (id, result) => {
  sql.query(
    "DELETE FROM teachereducation WHERE educationid = ?",
    id,
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

teachereducation.updateByEducationId = (updateData, result) => {
  const {
    educationid,
    level,
    specialization,
    InstitutionName,
    InstitutionAddress,
    university,
    mediumofInstruction,
    coursetype,
  } = updateData;

  sql.query(
    "UPDATE teachereducation SET level = ?, specialization = ?, InstitutionName = ?, InstitutionAddress = ?, university = ?, mediumofInstruction = ?, coursetype = ? WHERE educationid = ?",
    [
      level,
      specialization,
      InstitutionName,
      InstitutionAddress,
      university,
      mediumofInstruction,
      coursetype,
      educationid,
    ],
    (err, res) => {
      if (res?.affectedRows > 0) {
        result(null, { ...updateData });
      }
      if (err) {
        result(err, null);
        return;
      }
      if (res.affectedRows == 0) {
        // not found users with the id
        result({ kind: "not_found" }, null);
        return;
      }
    }
  );
};

module.exports = teachereducation;
