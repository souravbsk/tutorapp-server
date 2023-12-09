const sql = require("./db.js");

// constructor
const documents = function (documents) {
  this.userid = documents.userid;
  this.documenttype = documents.documenttype;
  this.documentname = documents.documentname;
  this.documentpath = documents.documentpath;
  this.verifystatus = documents.verifystatus;
};

documents.create = (newDocuments, result) => {
  const query = "INSERT INTO documents set ?";
  sql.query(query, newDocuments, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
  });
};

documents.findAll = (result) => {
  const query1 = `SELECT doc.id, doc.userid, doc.documenttype, doc.documentpathF, doc.documentpathB, doc.verifystatus, doc.uploaddate, doc.feedback, sli1.listItemName as documenttypeName, sli2.listItemName as verifystatusName FROM documents AS doc INNER JOIN systemlistitem AS sli1 ON doc.documenttype = sli1.listItemId INNER JOIN systemlistitem as sli2 on doc.verifystatus = sli2.listItemId`;

  const query2 = `select * from profile`;

  sql.query(query1, (err, res) => {
    if (err) {
      return result(err, null);
    }

    sql.query(query2, (err, res2) => {
      if (err) {
        return result(err, null);
      }
      if (res.length || res2.length) {
        let newDocumentData = [];
        res.forEach((result1) => {
          res2.forEach((result2) => {
            if (result1.userid == result2.userid) {
              const newResult = {
                userid: result1.userid,
                documentName: result1.documenttypeName,
                verifystatusName: result1.verifystatusName,
                userName: result2.poc,
                imageData: result1,
              };
              newDocumentData.push(newResult);
            }
          });
        });
        result(null, newDocumentData);
      }
    });
  });
};

documents.findById = (id, result) => {
  const query = `SELECT doc.id,doc.userid, doc.documenttype, doc.documentpathF,doc.documentpathB,doc.verifystatus,doc.uploaddate, doc.feedback, sli1.listItemName as documenttypeName , sli2.listItemName as verifystatusName FROM documents AS doc INNER JOIN systemlistitem AS sli1 ON doc.documenttype = sli1.listItemId INNER JOIN systemlistitem as sli2 on doc.verifystatus = sli2.listItemId WHERE doc.userid = ${id};`;

  sql.query(query, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length) {
      result(null, res);
      return;
    }
    // not found documents with the userid
    result({ kind: "not_found" }, null);
  });
};

documents.remove = (id, result) => {
  sql.query("DELETE FROM documents WHERE userid = ?", id, (err, res) => {
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
  });
};

documents.update = (id, newData, result) => {
  sql.query(
    "update documents set ? WHERE userid = ?",
    [newData, id],
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

module.exports = documents;
