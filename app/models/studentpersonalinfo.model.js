const sql = require("./db.js");


// constructor
const studentpersonalinfo = function(studentpersonalinfo) {
    this.userid = studentpersonalinfo.userid;
    this.relationwithstudent = studentpersonalinfo.relationwithstudent;
    this.dateofbirth = studentpersonalinfo.dateofbirth;
    this.studyingin = studentpersonalinfo.studyingin;
    this.board = studentpersonalinfo.board;
    this.institutename = studentpersonalinfo.institutename;
    this.institutelocation = studentpersonalinfo.institutelocation;

  };

  studentpersonalinfo.findById = (id, result) => {
    sql.query(
      `select * from studentpersonalinfo WHERE userid =${id}`,
      (err, res) => {
        if (err) {
          result(err, null);
          return;
        }
  
        if (res.length) {
          result(null, res[0]);
          return;
        }
  
        // not found studentpersonalinfo with the userid
        result({ kind: "not_found" }, null);
      }
    );
  };


  // ------------------------OK----------------------------
  studentpersonalinfo.create = (newstudentpersonalinfo, result) => {
    sql.query("INSERT INTO studentpersonalinfo SET ?", newstudentpersonalinfo, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, { id: res.insertId, ...newstudentpersonalinfo });
    });
  };


  studentpersonalinfo.updateById = (id, data, result) => {
 
    sql.query( "UPDATE studentpersonalinfo SET ? where userid = ?",[data,id] ,(err, res) => {
        if (err) {
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found studentpersonalinfo with the userid
          result({ kind: "not_found" }, null);
          return;
        }
  
        result(null, { id: id, ...data });
      }
    );
  };
  



  module.exports = studentpersonalinfo;