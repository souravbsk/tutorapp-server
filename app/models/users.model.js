const sql = require("./db.js");
const bcrypt = require("bcryptjs");

// constructor
const users = function (users) {
  this.userid = users.userid;
  this.roleid = users.roleid;
  this.isdcode = users.isdcode;
  this.mobile = users.mobile;
  this.email = users.email;
  this.password = users.password;
};

// ------------------OK---------------------
users.getAll = (result) => {
  let query =
    "SELECT *, role.name FROM users inner join role on users.roleid = role.roleid order by role.roleid ";

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

// --------------------OK----------------------
users.findById = (id, result) => {
  sql.query(
    `select *,role.name from users inner join role on users.roleid = role.roleid WHERE userid =${id}`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.length) {
        result(null, res);
        return;
      }
      // not found users with the id
      result({ kind: "not_found" }, null);
    }
  );
};

// --------------------OK----------------------
users.findUserByRoleid = (id, result) => {
  sql.query(
    `SELECT
    users.userid,
    pro.poc AS name,
    pro.emailId AS email,
    pro.primaryContact AS mobile,
    pro.whatsappNumber AS whatsapp,
    pro.gender,
    pro.address1,
    pro.address2,
    pro.profileimagepath,
    pi.dateofbirth AS dob,
    ts.segmentid,
    seg.name AS segmentname,
    ts.subjectid,
    sub.name as subjectname,
    sys.listItemName AS gender,
    sys1.listItemName AS experience
FROM users
INNER JOIN profile pro ON users.userid = pro.userid
INNER JOIN teacherproficiency tp ON users.userid = tp.userid
INNER JOIN teachersubject ts ON users.userid = ts.userid
INNER JOIN personalinfo pi ON users.userid = pi.userid
INNER JOIN systemlistitem sys ON pro.gender = sys.listItemId
INNER JOIN systemlistitem sys1 ON tp.expinyear = sys1.listItemId
INNER JOIN segment seg ON ts.segmentid = seg.segmentid
INNER JOIN subject sub on ts.subjectid = sub.subjectid

WHERE users.roleid = ${id}`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.length) {
        // ==============Grouping the data==================
        const groupedData = res.reduce((acc, item) => {
          const key = `${item.userid}_${item.name}_${item.email}_${item.mobile}_${item.whatsapp}_${item.gender}_${item.address1}_${item.address2}_${item.dob}_${item.experience}_${item.profileimagepath}`;

          if (!acc[key]) {
            acc[key] = {
              userid: item.userid,
              name: item.name,
              email: item.email,
              mobile: item.mobile,
              whatsapp: item.whatsapp,
              gender: item.gender,
              address1: item.address1,
              address2: item.address2,
              profileimagepath: item.profileimagepath,
              dob: item.dob,
              experience: item.experience,
              segments: [],
              segmentsid: [],
              subjectsid: [],
            };
          }

          const existingSegment = acc[key].segments.find(
            (segment) => segment.segmentname === item.segmentname
          );

          if (!existingSegment) {
            acc[key].segments.push({
              segmentname: item.segmentname,
              subjects: [item.subjectname],
            });
            acc[key].segmentsid.push(item.segmentid);
            acc[key].subjectsid.push(item.subjectid);
          } else {
            existingSegment.subjects.push(item.subjectname);
          }

          return acc;
        }, {});

        // Convert the groupedData object back to an array
        const resultArray = Object.values(groupedData);
        // ===============================================================
        result(null, resultArray);
        return;
      }
      // not found users with the id
      result({ kind: "not_found" }, null);
    }
  );
};

users.findUserByUserid = (id, teachingLocationId, laguageId, result) => {
  const query1 = `SELECT
  users.userid,
  COALESCE(pro.poc, 'N/A') AS name,
  COALESCE(pro.emailId, 'N/A') AS email,
  COALESCE(pro.primaryContact, 'N/A') AS mobile,
  COALESCE(pro.whatsappNumber, 'N/A') AS whatsapp,
  COALESCE(pro.gender, 'N/A') AS gender,
  COALESCE(pro.address1, 'N/A') AS address1,
  COALESCE(pro.address2, 'N/A') AS address2,
  COALESCE(pro.isContactVarified, 'N/A') AS isContactVarified,
  COALESCE(pro.isEmailVarified, 'N/A') AS isEmailVarified,
  COALESCE(pro.profileimagepath, 'N/A') AS profileimagepath,
  COALESCE(pi.dateofbirth, 'N/A') AS dob,
  ts.segmentid,
  COALESCE(seg.name, 'N/A') AS segmentname,
  ts.subjectid,
  COALESCE(sub.name, 'N/A') AS subjectname,
  COALESCE(sys.listItemName, 'N/A') AS gender,
  COALESCE(sys1.listItemName, 'N/A') AS experience,
  COALESCE(tp.trainingapproach, 'N/A') AS trainingapproach,
  COALESCE(sl.listName, 'N/A') AS interests,
  COALESCE(sys4.listItemName, 'N/A') AS vehicles,
  COALESCE(sys5.listItemName, 'N/A') AS specialization,
  COALESCE(sys3.listItemName, 'N/A') AS boards,
  AVG(ur.ratingsvalue) AS average_rating,
  users.created
FROM users
LEFT JOIN profile pro ON users.userid = pro.userid
LEFT JOIN teacherproficiency tp ON users.userid = tp.userid
LEFT JOIN teachersubject ts ON users.userid = ts.userid
LEFT JOIN personalinfo pi ON users.userid = pi.userid
LEFT JOIN teachertraininglevel ttl ON users.userid = ttl.userid
LEFT JOIN systemlistdata sld ON users.userid = sld.userid
LEFT JOIN teachereducation te ON users.userid = te.userid
LEFT JOIN systemlistitem sys ON pro.gender = sys.listItemId
LEFT JOIN systemlistitem sys1 ON tp.expinyear = sys1.listItemId
LEFT JOIN segment seg ON ts.segmentid = seg.segmentid
LEFT JOIN subject sub ON ts.subjectid = sub.subjectid
LEFT JOIN systemlistitem sys3 ON ttl.board = sys3.listItemId
LEFT JOIN systemlist sl ON sld.listid = sl.listId
LEFT JOIN systemlistitem sys4 ON pi.Vechiclesowend = sys4.listItemId
LEFT JOIN systemlistitem sys5 ON te.specialization = sys5.listItemId
LEFT JOIN userreviews ur ON users.userid = ur.revieweduserid
WHERE users.userid = ${id}`;

  const query2 = `SELECT sld.listid, sli.listItemName FROM systemlistdata sld INNER JOIN systemlistitem sli ON sld.listitemid = sli.listItemId WHERE sld.userid = ${id} AND sld.listid = ${teachingLocationId}`;

  const query3 = `SELECT sld.listid, sli.listItemName FROM systemlistdata sld INNER JOIN systemlistitem sli ON sld.listitemid = sli.listItemId WHERE sld.userid = ${id} AND sld.listid = ${laguageId}`;
  const query4 = `SELECT ur.*, pro.poc AS reviewed_username, pro.emailId AS reviewed_user_email, pro.primaryContact AS reviewed_user_mobile FROM userreviews ur INNER JOIN profile pro ON ur.userid = pro.userid WHERE ur.revieweduserid = ${id}`;
  let languageData = {};
  let locationData = {};

  sql.query(query1, (err, res1) => {
    if (err) {
      return result(err, null);
    }
    if (res1.length > 0) {
      sql.query(query2, (err2, res2) => {
        if (err2) {
          return result(err2, null);
        }
        sql.query(query3, (err3, res3) => {
          if (err3) {
            return result(err3, null);
          }

          sql.query(query4, (err4, res4) => {
            if (err4) {
              return result(err4, null);
            }
            if (res3) {
              languageData = res3.reduce((acc1, { listid, listItemName }) => {
                acc1[listid] = (acc1[listid] || []).concat(listItemName);
                return acc1;
              }, {});
            }

            if (res2) {
              locationData = res2.reduce((acc2, { listid, listItemName }) => {
                acc2[listid] = (acc2[listid] || []).concat(listItemName);
                return acc2;
              }, {});
            }

            // ==============Grouping and building the data==================
            const groupedData = res1.reduce((acc, item) => {
              const key = `${item.userid}_${item.name}_${item.email}_${item.mobile}_${item.whatsapp}_${item.gender}_${item.address1}_${item.address2}_${item.dob}_${item.experience}_${item.created}_${item.trainingapproach}_${item?.average_rating}_${item?.profileimagepath}_${item?.isContactVarified}_${item?.isEmailVarified}_${item?.specialization}`;

              if (!acc[key]) {
                console.log(item.specialization);
                acc[key] = {
                  userid: item.userid,
                  name: item.name,
                  email: item.email,
                  mobile: item.mobile,
                  whatsapp: item.whatsapp,
                  gender: item.gender,
                  address1: item.address1,
                  address2: item.address2,
                  profileimagepath: item.profileimagepath,
                  dob: item.dob,
                  isEmailVarified:item?.isEmailVarified,
                  isContactVarified:item?.isContactVarified,
                  average_rating: item?.average_rating,
                  experience: item.experience,
                  trainingapproach: item.trainingapproach,
                  vehiclesOwned: item.vehicles,
                  joiningDate: item.created,
                  reviews: res4,
                  specializations: item?.specialization,
                  interests: [],
                  boardNames: [item.boards],
                  language: languageData,
                  location: locationData,
                  reviews: res4,
                  segments: [],
                };
              } else {
                if (!acc[key].boardNames.includes(item.boards)) {
                  acc[key].boardNames.push(item.boards);
                }

                if (!acc[key].interests.includes(item.interests)) {
                  acc[key].interests.push(item.interests);
                }

                if (!acc[key].specializations.includes(item.specializaion)) {
                  acc[key].specializations.push(item.specializaion);
                }
              }

              const existingSegment = acc[key].segments.find(
                (segment) => segment.segmentname === item.segmentname
              );
              if (!existingSegment) {
                acc[key].segments.push({
                  segmentname: item.segmentname,
                  subjects: [item.subjectname],
                });
              } else {
                if (!existingSegment.subjects.includes(item.subjectname)) {
                  existingSegment.subjects.push(item.subjectname);
                }
              }
              return acc;
            }, {});

            const resultArrayFinal = Object.values(groupedData);
            // ===============================================================
            // Send the final response
            result(null, resultArrayFinal);
          });
        });
      });
    } else {
      result({ kind: "not_found" }, null);
    }
  });
};

users.findAllUsersByRoleId = (id, result) => {
  sql.query(
    `SELECT
    users.userid,
    pro.poc AS name,
    pro.emailId AS email,
    pro.primaryContact AS mobile,
    pro.whatsappNumber AS whatsapp,
    pro.gender,
    pro.address1,
    pro.address2,
    pro.profileimagepath,
    pi.dateofbirth AS dob,
    ts.segmentid,
    seg.name AS segmentname,
    ts.subjectid,
    sub.name as subjectname,
    sys.listItemName AS gender,
    sys1.listItemName AS experience
FROM users
INNER JOIN profile pro ON users.userid = pro.userid
INNER JOIN teacherproficiency tp ON users.userid = tp.userid
INNER JOIN teachersubject ts ON users.userid = ts.userid
INNER JOIN personalinfo pi ON users.userid = pi.userid
INNER JOIN systemlistitem sys ON pro.gender = sys.listItemId
INNER JOIN systemlistitem sys1 ON tp.expinyear = sys1.listItemId
INNER JOIN segment seg ON ts.segmentid = seg.segmentid
INNER JOIN subject sub on ts.subjectid = sub.subjectid

WHERE users.roleid = ${id}`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.length) {
        // ==============Grouping the data==================
        const groupedData = res.reduce((acc, item) => {
          const key = `${item.userid}_${item.name}_${item.email}_${item.mobile}_${item.whatsapp}_${item.gender}_${item.address1}_${item.address2}_${item.dob}_${item.experience}_${item.profileimagepath}`;

          if (!acc[key]) {
            acc[key] = {
              userid: item.userid,
              name: item.name,
              email: item.email,
              mobile: item.mobile,
              whatsapp: item.whatsapp,
              gender: item.gender,
              address1: item.address1,
              address2: item.address2,
              profileimagepath: item.profileimagepath,
              dob: item.dob,
              experience: item.experience,
              segments: [],
              segmentsid: [],
              subjectsid: [],
            };
          }

          const existingSegment = acc[key].segments.find(
            (segment) => segment.segmentname === item.segmentname
          );

          if (!existingSegment) {
            acc[key].segments.push({
              segmentname: item.segmentname,
              subjects: [item.subjectname],
            });
            acc[key].segmentsid.push(item.segmentid);
            acc[key].subjectsid.push(item.subjectid);
          } else {
            existingSegment.subjects.push(item.subjectname);
          }

          return acc;
        }, {});

        // Convert the groupedData object back to an array
        const resultArray = Object.values(groupedData);
        // ===============================================================
        result(null, resultArray);
        return;
      }
      // not found users with the id
      result({ kind: "not_found" }, null);
    }
  );
};

// ------------------------OK----------------------------
users.duplicateMobileNo = (mobile, result) => {
  sql.query(
    `select *,role.name from users inner join role on users.roleid = role.roleid WHERE mobile =${mobile}`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res[0]);
        return;
      }

      // not found Tutorial with the id
      result({ kind: "not_found" }, null);
    }
  );
};

// ------------------------OK----------------------------
users.duplicateEmail = (id, result) => {
  sql.query(
    "select *,role.name from users inner join role on users.roleid = role.roleid where email = ?",
    id,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.length) {
        result(null, res[0]);
        return;
      }
      // not found users with the id
      result({ kind: "not_found" }, null);
    }
  );
};

users.duplicateChecker = (users, result) => {
  sql.query(
    "SELECT email, mobile FROM users WHERE email= ? OR mobile= ?",
    [users.email, users.mobile],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.length) {
        result(null, res[0]);
        return;
      }
      // not found users data with the data
      result({ kind: "not_found" }, null);
    }
  );
};

// ------------------------OK----------------------------
users.create = (newusers, result) => {
  sql.query("INSERT INTO users SET ?", newusers, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newusers });
  });
};

// ------------------------OK----------------------------
users.remove = (id, result) => {
  sql.query("DELETE FROM users WHERE userid = ?", id, (err, res) => {
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

// ------------------------OK----------------------------
users.updateById = async (id, users, result) => {
  const salt = await bcrypt.genSalt(10);
  const hasPassword = await bcrypt.hash(users.password, salt);
  sql.query(
    "UPDATE users SET roleid=?, mobile=?, email=?,password=?,isdcode=? where userid = ?",
    [users.roleid, users.mobile, users.email, hasPassword, users.isdcode, id],
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

      result(null, { id: id, ...users });
    }
  );
};

users.updateByUserId = (id, users, result) => {
  sql.query("UPDATE users SET ? where userid = ?", [users, id], (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      // not found users with the userid
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: id, ...users });
  });
};

users.updateMobileEmailById = (id, users, result) => {
  sql.query("UPDATE users SET ? where userid= ?", [users, id], (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found users with the id
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, { id: id, ...users });
  });
};

users.findByEmailOrMobile = (email, mobile, result) => {
  let query = "SELECT * FROM users";

  const params = [];

  if (email) {
    query += " WHERE email = ?";
    params.push(email);
  }

  if (mobile) {
    if (params.length === 0) {
      query += " WHERE mobile = ?";
    } else {
      query += " OR mobile = ?";
    }
    params.push(mobile);
  }

  sql.query(query, params, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    if (res.length) {
      result(null, res[0]);
      return;
    }

    result({ message: "User not found" }, null);
  });
};

users.findUsersByEmailRoleId = (userId, roleId, result) => {
  sql.query(
    `SELECT profile.userid, profile.poc, profile.emailId, users.roleid FROM profile JOIN users ON profile.userid =users.userid WHERE profile.userid = ${userId}`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res[0]);
        return;
      }
      // not found users with the mobile
      result({ kind: "not_found" }, null);
    }
  );
};

users.findPassword = (id, result) => {
  sql.query(
    `select *,role.name from users inner join role on users.roleid = role.roleid WHERE userid =${id}`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.length) {
        result(null, res[0]);
        return;
      }
      // not found users with the id
      result({ kind: "not_found" }, null);
    }
  );
};

users.updateUsersPassword = async (id, users, result) => {
  const salt = await bcrypt.genSalt(10);
  const hasPassword = await bcrypt.hash(users.password, salt);
  sql.query(
    "UPDATE users SET password=? where userid = ?",
    [hasPassword, id],
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
      result(null, { id: id, ...users });
    }
  );
};



users.sendmessageusersdetailsbyid = (userid,result) => {
  sql.query(
    `SELECT profile.userid, profile.poc, profile.emailId, users.roleid FROM profile JOIN users ON profile.userid =users.userid WHERE profile.userid = ${userId}`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res[0]);
        return;
      }
      // not found users with the mobile
      result({ kind: "not_found" }, null);
    }
  );
};



module.exports = users;
