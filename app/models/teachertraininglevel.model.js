const sql = require("./db.js");

// Constructor for teachertraininglevel model
const teachertraininglevel = function (teachertraininglevel) {
  this.userid = teachertraininglevel.userid;
  this.board = teachertraininglevel.board;
  this.price = teachertraininglevel.price;
  this.segmentid = teachertraininglevel.segmentid;
};

// Create a new teachertraininglevel relationship
teachertraininglevel.create = (newTeachertraininglevel, result) => {
  sql.query(
    "INSERT INTO teachertraininglevel SET ?",
    newTeachertraininglevel,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      result(null, { id: res.insertId, ...newTeachertraininglevel });
    }
  );
};

teachertraininglevel.getAll = (id, result) => {
  // let query = `SELECT id, userid,seg.segmentid,seg.name AS segment_name, sys.listItemName AS board_name, price FROM teachertraininglevel AS tt INNER JOIN segment AS seg on tt.segmentid = seg.segmentid INNER JOIN systemlistitem AS sys on tt.board = sys.listItemId where userid = ${id} `;

  let query = `SELECT
  tt.id,
  tt.userid,
  tt.board AS board_id,
  seg.segmentid,
  seg.name AS segment_name,
  seg.categoryid AS category_id,
cat.name AS category_Name,
  sys.listItemName AS board_name,
  tt.price
FROM
  teachertraininglevel AS tt
INNER JOIN
  segment AS seg
ON
  tt.segmentid = seg.segmentid
INNER JOIN
  systemlistitem AS sys
ON
  tt.board = sys.listItemId
INNER JOIN 
category AS cat 
ON
seg.categoryid = cat.categoryid
WHERE
  tt.userid = ${id};
`;

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

// To delete data from teachertraininglevel,teachersubject, & systemlistdata of teacher only
teachertraininglevel.delete = (userid, listid, result) => {
  const query1 = `DELETE FROM teachertraininglevel WHERE userid = ${userid};`;
  const query2 = `DELETE FROM teacherproficiency WHERE userid = ${userid};`;
  const query3 = `DELETE FROM teachersubject WHERE userid = ${userid};`;
  const query4 = `DELETE FROM systemlistdata WHERE listid = ${listid} and userid = ${userid};`;

  sql.query(query1, (err, res1) => {
    if (err) {
      result(null, err);
      return;
    }
    sql.query(query2, (err, res2) => {
      if (err) {
        result(null, err);
        return;
      }
      sql.query(query3, (err, res3) => {
        if (err) {
          result(null, err);
          return;
        }
        sql.query(query4, (err, res4) => {
          if (err) {
            result(null, err);
            return;
          }

          if (res1 || res2 || res3) {
            const delteResult = {
              success: true,
              result1: res1,
              result2: res2,
              result3: res3,
              result4: res4,
            };

            result(null, delteResult);
          }
        });
      });
    });
  });
};

module.exports = teachertraininglevel;

// SELECT id, userid,seg.segmentid,seg.name AS segment_name, sys.listItemName AS board_name, price FROM teachertraininglevel AS tt INNER JOIN segment AS seg on tt.segmentid = seg.segmentid INNER JOIN systemlistitem AS sys on tt.board = sys.listItemId where userid =

// SELECT id, userid,seg.segmentid,seg.name AS segment_name, sys.listItemName AS board_name, price FROM teachertraininglevel AS tt INNER JOIN segment AS seg on tt.segmentid = seg.segmentid INNER JOIN systemlistitem AS sys on tt.board = sys.listItemId where userid =
