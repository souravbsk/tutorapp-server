const sql = require("./db.js");

// constructor
const subject = function (subject) {
  this.name = subject.name;
  this.subjectId = subject.subjectId;
  this.segmentId = subject.segmentId;
};

subject.create = (newsubject, result) => {
  sql.query("INSERT INTO subject SET ?", newsubject, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newsubject });
  });
};

subject.findById = (subjectId, result) => {
  sql.query(
    `SELECT sub.subjectid, sub.name, seg.name segname,  cat.name  categoryname FROM subject sub inner join segment seg on sub.segmentid = seg.segmentid INNER JOIN category cat ON seg.categoryid = cat.categoryid WHERE subjectid = ${subjectId}`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res[0]);
        return;
      }

      // not found subject with the id
      result({ kind: "not_found" }, null);
    }
  );
};

// -----------ok---------------
subject.getSubjectBySegmentId = (id, result) => {
  let query = `SELECT * FROM subject where segmentid = ${id}`;

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

// -------------- subject is OK----------------
subject.getAll = (result) => {
  let query =
    "SELECT sub.subjectid, sub.name, seg.name segname,  cat.name  categoryname FROM subject sub inner join segment seg on sub.segmentid = seg.segmentid INNER JOIN category cat ON seg.categoryid = cat.categoryid order by seg.segmentid";

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

subject.updateById = (id, subject, result) => {
  sql.query(
    "UPDATE subject SET name = ? , segmentid=? where subjectid = ?",
    [subject.name, subject.segmentId, Number(id)],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found subject with the id
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: id, ...subject });
    }
  );
};

subject.remove = (id, result) => {
  sql.query("DELETE FROM subject WHERE subjectid = ?", id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found subject with the id
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, res);
  });
};

module.exports = subject;
