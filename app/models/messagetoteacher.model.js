const sql = require("./db");
const messagetoteacher = function (messagetoteacher) {
  this.userid = messagetoteacher.userid;
  this.senderid = messagetoteacher.senderid;
  this.messagetitle = messagetoteacher.messagetitle;
  this.segmentid = messagetoteacher.segmentid;
  this.subjectid = messagetoteacher.subjectid;
  this.locationid = messagetoteacher.locationid;
  this.description = messagetoteacher.description;
  this.budget = messagetoteacher.budget;
};

messagetoteacher.create = (newMsg, result) => {
    const query = "insert into messagetoteacher set ?";
    sql.query(query, newMsg, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, { id: res.insertId, ...newMsg });
    });
  };


  messagetoteacher.findById = (id, result) => {
    const query = `SELECT
    mt.messageid,
    mt.userid,
    mt.senderid,
    mt.messagetitle,
    mt.segmentid,
    seg.name as segmentname,
    mt.subjectid,
    sub.name as subjectname,
    mt.locationid,
    sys.listItemName as locationname,
    mt.description,
    mt.budget,
    mt.receivedate
    from messagetoteacher as mt
    INNER JOIN segment as seg on mt.segmentid = seg.segmentid
    INNER JOIN subject as sub on mt.subjectid = sub.subjectid
    INNER JOIN systemlistitem as sys on mt.locationid = sys.listItemId
    WHERE mt.senderid = ${id};`;
  
    sql.query(query, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.length) {
        result(null, res);
        return;
      }
      // not found messagetoteacher with the senderid
      result({ kind: "not_found" }, null);
    });
  };
  








module.exports = messagetoteacher;