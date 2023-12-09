const sql = require("./db.js");

// constructor
const profile = function (profile) {
  this.userid = profile.userid;
  this.instituteName = profile.instituteName;
  this.poc = profile.poc;
  this.emailId = profile.emailId;
  this.isEmailVarified = profile.isEmailVarified;
  this.primaryContact = profile.primaryContact;
  this.isContactVarified = profile.isContactVarified;
  this.whatsappNumber = profile.whatsappNumber;
  this.gender = profile.gender;
  // this.interestedIn = profile.interestedIn;
  this.instituteCategory = profile.instituteCategory;
  this.isAgreeTnc = profile.isAgreeTnc;
  this.landlineNumber = profile.landlineNumber;
  this.alternativeNumber = profile.alternativeNumber;
  this.address1 = profile.address1;
  this.address2 = profile.address2;
  this.profileimagepath = profile.profileimagepath;
};

// -------------------OK-------------------
profile.getAll = (result) => {
  let query = "SELECT * FROM profile";

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

// -------------------OK-------------------
profile.findById = (id, result) => {

  sql.query(`select * from profile  WHERE userid =${id}`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res[0]);
      return;
    }

    // not found profile with the id
    result({ kind: "not_found" }, null);
  });
};

// -------------------OK-------------------
profile.findByUserId = (id, result) => {
  sql.query(
    `select * , sys.listItemName from profile prof inner join systemlistitem sys on prof.gender = sys.listItemId  WHERE userid =${id} `,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res[0]);
        return;
      }

      // not found profile with the id
      result({ kind: "not_found" }, null);
    }
  );
};

// -------------------OK-------------------
profile.create = (newprofile, result) => {
  sql.query("INSERT INTO profile SET ?", newprofile, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newprofile });
  });
};

// -------------------OK-------------------
profile.remove = (id, result) => {
  sql.query("DELETE FROM profile WHERE profileid = ?", id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found profile with the id
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, res);
  });
};

// -------------------OK-------------------
profile.updateById = (id, profile, result) => {
  sql.query(
    "UPDATE profile SET ?  where userid = ?",
    [profile, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found profile with the id
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: id, ...profile, res });
    }
  );
};

// profile.create = (newprofile, result) => {
//   sql.query("INSERT INTO teacherinterestedin SET ?", newprofile, (err, res) => {
//     if (err) {
//       result(err, null);
//       return;
//     }

//     result(null, { id: res.insertId, ...newprofile });
//   });
// };

module.exports = profile;
