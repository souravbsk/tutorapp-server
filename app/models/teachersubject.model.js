const sql = require("./db.js");

// Constructor for teachersubject model
const teachersubject = function (teacherSubject) {
  this.userid = teacherSubject.userid;
  this.segmentid = teacherSubject.segmentid;
  this.subjectid = teacherSubject.subjectid;
};

teachersubject.create = (newTeacherSubject, result) => {
  sql.query(
    "INSERT INTO teachersubject SET ?",
    newTeacherSubject,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, { id: res.insertId, ...newTeacherSubject });
    }
  );
};

teachersubject.findById = (id, result) => {
  sql.query(
    // `SELECT id, userid, ts.segmentid, sub.name AS subject, seg.name AS segment FROM teachersubject AS ts INNER JOIN subject AS sub ON ts.subjectid = sub.subjectid INNER JOIN segment AS seg ON ts.segmentid = seg.segmentid WHERE ts.userid = ${id}`,

//     `SELECT ts.id, ts.userid, ts.segmentid, sub.name AS subject, seg.name AS segment, tt.board AS board_name, tt.price
// FROM teachersubject AS ts
// INNER JOIN subject AS sub ON ts.subjectid = sub.subjectid
// INNER JOIN segment AS seg ON ts.segmentid = seg.segmentid
// INNER JOIN teachertraininglevel AS tt ON ts.userid = tt.userid AND ts.segmentid = tt.segmentid
// WHERE ts.userid = ${id}`,

`SELECT ts.id, ts.subjectid, ts.userid, ts.segmentid, sub.name FROM teachersubject AS ts INNER JOIN subject AS sub ON ts.subjectid = sub.subjectid WHERE ts.userid = ${id}`,

    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      result(null, res);
    }
  );
};

teachersubject.findOneById = (id, result) => {
  sql.query(
`SELECT ts.id, ts.userid, ts.subjectid, sub.name AS subjectName, ts.segmentid, seg.name as segmentName FROM teachersubject AS ts INNER JOIN subject AS sub ON ts.subjectid = sub.subjectid INNER JOIN segment AS seg ON ts.segmentid = seg.segmentid WHERE ts.userid = ${id}`,

    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      result(null, res);
    }
  );
};



teachersubject.updateByUserId = (id, newTeacherSubject, result) => {
  sql.query(
    "UPDATE teachersubject SET ? where userid = ?",
    [newTeacherSubject, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found teachersubject with the userid
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: id, ...newTeacherSubject });
    }
  );
};

// =================For Student subject entry===================
const studentSubject = function (studentSubject) {
  this.userid = studentSubject.userid;
  this.segmentid = studentSubject.segmentid;
  this.subjectid = studentSubject.subjectid;
};

studentSubject.studentcreate = (newStudentSubject, result) => {
  sql.query(
    "INSERT INTO teachersubject SET ?", // Change "teachersubject" to "studentsubject"
    newStudentSubject,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, { id: res.insertId, ...newStudentSubject });
    }
  );
};
module.exports = {
  teachersubject: teachersubject,
  studentSubject: studentSubject,
};


// SELECT id, userid, ts.segmentid, sub.name AS subject, seg.name AS segment FROM teachersubject AS ts INNER JOIN subject AS sub ON ts.subjectid = sub.subjectid INNER JOIN segment AS seg ON ts.segmentid = seg.segmentid WHERE ts.userid = 