const sql = require("./db.js");

// constructor
const segment = function (segment) {
  this.name = segment.name;
  this.categoryid = segment.categoryid;
};

// -----------ok---------------
segment.getAll = (result) => {
  let query =
    "SELECT seg.segmentid, seg.name, seg.categoryid, cat.name catname FROM segment seg inner join category cat on seg.categoryid = cat.categoryid order by seg.categoryid";

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

// -----------ok---------------
segment.create = (newsegment, result) => {
  sql.query("INSERT INTO segment SET ?", newsegment, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newsegment });
  });
};

// -----------ok---------------
segment.findById = (id, result) => {
  sql.query(`SELECT * FROM segment WHERE segmentid = ${id}`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res[0]);
      return;
    }

    // not found segment with the id
    result({ kind: "not_found" }, null);
  });
};

// -----------ok---------------
segment.getSegmentsBycategoryId = (id, result) => {
  let query = `SELECT * FROM segment where categoryid = ${id}`;

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

// -----------ok---------------
segment.updateSegmentBySegmentId = (id, segment, result) => {
  sql.query(
    "UPDATE segment SET name = ? , categoryid=? where segmentid = ?",
    [segment.name, segment.categoryid, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found segment with the id
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: id, ...segment });
    }
  );
};

// -----------ok---------------
segment.remove = (id, result) => {
  sql.query("DELETE FROM segment WHERE segmentid = ?", id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found segment with the id
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, res);
  });
};

module.exports = segment;
