const sql = require("./db");

const subscriptionplans = function (subscriptionplans) {
  this.planname = subscriptionplans.planname;
  this.description = subscriptionplans.description;
  this.planperiod = subscriptionplans.planperiod;
  this.planterm = subscriptionplans.planterm;
  this.amount = subscriptionplans.amount;
  this.plantype = subscriptionplans.plantype;
  this.status = subscriptionplans.status;
};

subscriptionplans.create = (newsubs, result) => {
  const query = "insert into subscriptionplans set ?";
  sql.query(query, newsubs, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newsubs });
  });
};

subscriptionplans.getAll = (result) => {
  let query =
    "SELECT subs.planid, subs.planname, subs.description, subs.planperiod, subs.planterm, subs.amount, subs.plantype, subs.status, sys.listItemName as planperiod, sys.listItemId as planperiodvalue, sys2.listItemName AS plantypename FROM subscriptionplans as subs INNER JOIN systemlistitem as sys ON subs.planperiod = sys.listItemId INNER JOIN systemlistitem as sys2 ON subs.plantype = sys2.listItemId;";
  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};

subscriptionplans.getAllByStatus = (plantype1,plantype2,plantype3,plantype4,result) => {
  let query = `SELECT subs.planid, subs.planname, subs.description, subs.planperiod, subs.planterm, subs.amount, subs.plantype, subs.status, sys.listItemName as planperiod, sys.listItemId as planperiodvalue FROM subscriptionplans as subs INNER JOIN systemlistitem as sys ON subs.planperiod = sys.listItemId where subs.status = 1 and subs.plantype = ${plantype1} or subs.plantype = ${plantype2} or subs.plantype = ${plantype3}`;

  if(plantype4 == 849){
    query =
    `SELECT subs.planid, subs.planname, subs.description, subs.planperiod, subs.planterm, subs.amount, subs.plantype, subs.status, sys.listItemName as planperiod, sys.listItemId as planperiodvalue FROM subscriptionplans as subs INNER JOIN systemlistitem as sys ON subs.planperiod = sys.listItemId where subs.status = 1 and subs.plantype = ${plantype4}`;
  }
 
  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};

subscriptionplans.updateByPlanId = (id, newSubs, result) => {
  sql.query(
    "UPDATE subscriptionplans SET ?  where planid = ?",
    [newSubs, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        // not found subscriptionplans with the id
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, { id: id, ...newSubs });
    }
  );
};

subscriptionplans.remove = (id, result) => {
  sql.query(
    `DELETE FROM subscriptionplans WHERE planid = ${id}`,
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

module.exports = subscriptionplans;
