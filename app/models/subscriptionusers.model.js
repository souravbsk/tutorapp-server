const sql = require("./db");

const subscriptionusers = function (subscriptionusers) {
  this.userid = subscriptionusers.userid;
  this.planid = subscriptionusers.planid;
  this.startdate = subscriptionusers.startdate;
  this.expdate = subscriptionusers.expdate;
  this.totalclicks = subscriptionusers.totalclicks;
  this.usedclicks = subscriptionusers.usedclicks;
  this.status = subscriptionusers.status;
};

subscriptionusers.create = (newplan, result) => {
  const query = "insert into subscriptionusers set ?";
  sql.query(query, newplan, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
  });
};


subscriptionusers.findById = (id, plantype, result) => {
  const query = `SELECT 
  su.subscriptionusers_id,
  su.userid,
  su.planid,
  sp.planname as planname,
  sp.plantype,
  sys.listid as plantypeid,
  sys.listItemName as plantypename,
  sys2.listid as planperiodid,
  sys2.listItemName as planperiodname,
  su.startdate,
  su.expdate,
  su.totalclicks,
  su.usedclicks,
  su.status
  FROM subscriptionusers su 
  INNER JOIN subscriptionplans sp on su.planid = sp.planid
  INNER JOIN systemlistitem sys on sp.plantype = sys.listItemId
  INNER JOIN systemlistitem sys2 on sp.planperiod = sys2.listItemId
  WHERE su.userid = ${id} and sp.plantype=${plantype} `;
  sql.query(query, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
  });
};

subscriptionusers.update = (id, result) => {
  const query = `update subscriptionusers set usedclicks = usedclicks+1 WHERE subscriptionusers_id =${id}`;
  sql.query(query, (err, res) => {
    console.log(res);
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
  });
};




module.exports = subscriptionusers;
