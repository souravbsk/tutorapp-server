const sql = require("./db.js");

// constructor
const studentlevel = function (studentlevel) {
  this.userid = users.userid;
  this.segmentid = users.segmentid;
  this.locationid = users.locationid;
  this.instructionmedium = users.instructionmedium;
  this.studentsgroup = users.studentsgroup;
  this.sessionsperweek = users.sessionsperweek;
  this.budget = users.budget;
  this.privacyid = users.privacyid;
  this.bestcalltime = users.bestcalltime;
  this.requirementdesc = users.requirementdesc;
  this.gender = users.gender;
  this.maritalstatus = users.maritalstatus;
  this.agegroup = users.agegroup;
  this.schoolingpref = users.schoolingpref;
};

// ------------------------OK----------------------------
studentlevel.create = (newStudentlevel, result) => {
  sql.query("INSERT INTO studentlevel SET ?", newStudentlevel, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newStudentlevel });
  });
};

// -----------ok---------------
studentlevel.findById = (id, result) => {
  sql.query(
    `SELECT *, sg.listItemName AS genPref, sm.listItemName AS martial, sa.listItemName AS agegroup, ss.listItemName AS schooling FROM studentlevel stud INNER JOIN systemlistitem sg ON stud.gender = sg.listItemId INNER JOIN systemlistitem sm ON stud.maritalstatus = sm.listItemId INNER JOIN systemlistitem sa ON stud.agegroup = sa.listItemId INNER JOIN systemlistitem ss ON stud.schoolingpref = ss.listItemId WHERE stud.userid = ${id}; `,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res[0]);
        return;
      }

      // not found studentlevel with the userid
      result({ kind: "not_found" }, null);
    }
  );
};

// -----------ok---------------
studentlevel.findAllById = (id, result) => {
  const getAllQuery = `SELECT stud.id, stud.userid, stud.segmentid, seg.name AS segmentName, stud.locationid, sl.listItemName AS locationName, stud.instructionmedium, si.listItemName AS mediumName, stud.studentsgroup, sgr.listItemName AS groupName, stud.sessionsperweek, spw.listItemName AS sessionsName, stud.budget, stud.privacyid, spr.listItemName AS privayName, stud.bestcalltime, sbc.listItemName AS calltimeName, stud.requirementdesc, stud.gender, sg.listItemName AS genPref, stud.maritalstatus, sm.listItemName AS martial, stud.agegroup, sa.listItemName AS agegroup, stud.schoolingpref, ss.listItemName AS schooling, pro.emailId AS email, pro.primaryContact as mobile, pro.address1 as address1, pro.address2 as address2 FROM studentlevel stud INNER JOIN systemlistitem sg ON stud.gender = sg.listItemId INNER JOIN systemlistitem sm ON stud.maritalstatus = sm.listItemId INNER JOIN systemlistitem sa ON stud.agegroup = sa.listItemId INNER JOIN systemlistitem ss ON stud.schoolingpref = ss.listItemId INNER JOIN segment seg ON stud.segmentid = seg.segmentid INNER JOIN systemlistitem sl ON stud.locationid = sl.listItemId INNER JOIN systemlistitem si ON stud.instructionmedium = si.listItemId INNER JOIN systemlistitem sgr ON stud.studentsgroup = sgr.listItemId INNER JOIN systemlistitem spw ON stud.sessionsperweek = spw.listItemId INNER JOIN systemlistitem spr ON stud.privacyid = spr.listItemId INNER JOIN systemlistitem sbc ON stud.bestcalltime = sbc.listItemId INNER JOIN profile pro on stud.userid = pro.userid WHERE stud.userid = ${id};`

  const getSegmentQuery = `SELECT ts.id, ts.subjectid, ts.userid, ts.segmentid, sub.name FROM teachersubject AS ts INNER JOIN subject AS sub ON ts.subjectid = sub.subjectid WHERE ts.userid = ${id}`

  sql.query(getAllQuery, (err, res1) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res1.length) {
      sql.query(getSegmentQuery,(err,res2)=>{
        if (err) {
          result(err, null);
          return;
        }
        if(res2.length){

          const combinedResults = res1.map((result1) => {
            const matchingResult2 = res2.filter(
              (result2) =>
                result1.userid == result2.userid &&
                result1.segmentid == result2.segmentid
            );
    
            return {
              ...result1,
              subjects: matchingResult2 ? matchingResult2 : [],
            };
          });


          // const allData = [res1,res2]
          result(null, combinedResults);
        }
      })
      
      return;
    }
    // not found studentlevel with the userid
    result({ kind: "not_found" }, null);
  });
};

// -----------ok---------------
studentlevel.updatebyUserId = (id, newStudentLevel, result) => {
  sql.query(
    "UPDATE studentlevel SET ? where userid = ?",
    [newStudentLevel, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found studentlevel with the userid
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: id, ...studentlevel });
    }
  );
};

studentlevel.getAll = (userid, result) => {

  let userquery = `SELECT profile.address1 FROM users INNER JOIN profile ON users.userid = profile.userid WHERE users.userid = ${userid}`;

  sql.query(userquery, (err, user) => {
    if (err) {
      result(null, err);
      return;
    }

    const userCodematch = user[0]?.address1?.match(/\b\d{6}\b/);
    const userPostalCode = userCodematch ? parseInt(userCodematch[0]) : null;

    let segmentQuery = `SELECT segment.segmentid, segment.name FROM teachersubject JOIN segment ON teachersubject.segmentid = segment.segmentid WHERE teachersubject.userid = ${userid}`;

    sql.query(segmentQuery, (err, userSegmentres) => {
      const teacherAllSegmentIds = [];
      const teacherSegmentNames = [];
      userSegmentres.forEach(function (result) {
        teacherAllSegmentIds.push(result.segmentid);
        teacherSegmentNames.push(result.name);
      });

      let teacherSegmentIds = teacherAllSegmentIds.filter(
        (value, index, self) => {
          return self.indexOf(value) === index;
        }
      );

      let query = `SELECT
      stud.id,
      stud.userid,
      pro.poc AS username,
      pro.emailId AS useremail,
      pro.primaryContact AS usermobile,
      pro.address1 as addressone,
      pro.address2 AS addresstwo,
      pro.whatsappNumber AS whatsappNumber,
      pro.gender AS gender,
      pro.profileimagepath,
      users.isdcode,
      stud.segmentid,
      seg.name AS segmentName,
      stud.locationid,
      sl.listItemName AS locationName,
      stud.instructionmedium,
      si.listItemName AS mediumName,
      stud.studentsgroup,
      sgr.listItemName AS groupName,
      stud.sessionsperweek,
      spw.listItemName AS sessionsName,
      stud.budget,
      stud.privacyid,
      spr.listItemName AS privacyName,
      stud.bestcalltime,
      sbc.listItemName AS calltimeName,
      stud.requirementdesc,
      stud.gender AS genPref,
      stud.maritalstatus,
      sm.listItemName AS marital,
      stud.agegroup,
      sa.listItemName AS agegroup,
      stud.schoolingpref,
      ss.listItemName AS schooling,
      AVG(ur.ratingsvalue) AS average_rating,
      COUNT(ur.reviewtext) AS total_reviews
  FROM
      studentlevel stud
      INNER JOIN systemlistitem sg ON stud.gender = sg.listItemId
      INNER JOIN systemlistitem sm ON stud.maritalstatus = sm.listItemId
      INNER JOIN systemlistitem sa ON stud.agegroup = sa.listItemId
      INNER JOIN systemlistitem ss ON stud.schoolingpref = ss.listItemId
      INNER JOIN segment seg ON stud.segmentid = seg.segmentid
      INNER JOIN systemlistitem sl ON stud.locationid = sl.listItemId
      INNER JOIN systemlistitem si ON stud.instructionmedium = si.listItemId
      INNER JOIN systemlistitem sgr ON stud.studentsgroup = sgr.listItemId
      INNER JOIN systemlistitem spw ON stud.sessionsperweek = spw.listItemId
      INNER JOIN systemlistitem spr ON stud.privacyid = spr.listItemId
      INNER JOIN systemlistitem sbc ON stud.bestcalltime = sbc.listItemId
      INNER JOIN profile pro ON stud.userid = pro.userid
      INNER JOIN users ON stud.userid = users.userid
      LEFT JOIN userreviews ur ON stud.userid = ur.revieweduserid
  GROUP BY
      stud.id,
      stud.userid,
      pro.poc,
      pro.emailId,
      pro.primaryContact,
      pro.address1,
      pro.address2,
      pro.whatsappNumber,
      pro.gender,
      users.isdcode,
      stud.segmentid,
      seg.name,
      stud.locationid,
      sl.listItemName,
      stud.instructionmedium,
      si.listItemName,
      stud.studentsgroup,
      sgr.listItemName,
      stud.sessionsperweek,
      spw.listItemName,
      stud.budget,
      stud.privacyid,
      spr.listItemName,
      stud.bestcalltime,
      sbc.listItemName,
      stud.requirementdesc,
      stud.gender,
      stud.maritalstatus,
      sm.listItemName,
      stud.agegroup,
      sa.listItemName,
      stud.schoolingpref,
      ss.listItemName;  
    `;

      sql.query(query, (err, res1) => {
        if (err) {
          result(null, err);
          return;
        }

        let query2 = `SELECT ts.id, ts.subjectid, ts.userid, ts.segmentid, sub.name
        FROM teachersubject AS ts
        INNER JOIN subject AS sub ON ts.subjectid = sub.subjectid;
        `;

        sql.query(query2, (err, res2) => {
          if (err) {
            result(null, err);
            return;
          }

          const combinedResults = res1.map((result1) => {
            const matchingResult2 = res2.filter(
              (result2) =>
                result1.userid == result2.userid &&
                result1.segmentid == result2.segmentid
            );

            const userCodematch = result1.addressone?.match(/\b\d{6}\b/);
            const studentPostalCode = userCodematch
              ? parseInt(userCodematch[0])
              : null;
            // filter base on student location
            if (studentPostalCode === userPostalCode) {
              return {
                ...result1,
                subjects: matchingResult2 ? matchingResult2 : [],
              };
            }
          });

          // filter base on segment id
          const finalResult = combinedResults.filter((value) =>
            teacherSegmentIds.includes(value?.segmentid)
          );

          result(null, finalResult);
        });
      });
    });
  });
};

studentlevel.getstudentlevelid = (id, result) => {
  sql.query(
    ` 
    SELECT
    stud.id,
    stud.userid,
    pro.poc AS username,
    pro.emailId AS useremail,
    pro.primaryContact AS usermobile,
    pro.address1 as addressone,
    pro.address2 AS addresstwo,
    pro.whatsappNumber AS whatsappNumber,
    pro.gender AS gender,
    users.isdcode,
    stud.segmentid,
    seg.name AS segmentName,
    stud.locationid,
    sl.listItemName AS locationName,
    stud.instructionmedium,
    si.listItemName AS mediumName,
    stud.studentsgroup,
    sgr.listItemName AS groupName,
    stud.sessionsperweek,
    spw.listItemName AS sessionsName,
    stud.budget,
    stud.privacyid,
    spr.listItemName AS privacyName,
    stud.bestcalltime,
    sbc.listItemName AS calltimeName,
    stud.requirementdesc,
    stud.gender AS genPref,
    stud.maritalstatus,
    sm.listItemName AS marital,
    stud.agegroup,
    sa.listItemName AS agegroup,
    stud.schoolingpref,
    ss.listItemName AS schooling,
    AVG(ur.ratingsvalue) AS average_rating,
    COUNT(ur.reviewtext) AS total_reviews
FROM
    studentlevel stud
    INNER JOIN systemlistitem sg ON stud.gender = sg.listItemId
    INNER JOIN systemlistitem sm ON stud.maritalstatus = sm.listItemId
    INNER JOIN systemlistitem sa ON stud.agegroup = sa.listItemId
    INNER JOIN systemlistitem ss ON stud.schoolingpref = ss.listItemId
    INNER JOIN segment seg ON stud.segmentid = seg.segmentid
    INNER JOIN systemlistitem sl ON stud.locationid = sl.listItemId
    INNER JOIN systemlistitem si ON stud.instructionmedium = si.listItemId
    INNER JOIN systemlistitem sgr ON stud.studentsgroup = sgr.listItemId
    INNER JOIN systemlistitem spw ON stud.sessionsperweek = spw.listItemId
    INNER JOIN systemlistitem spr ON stud.privacyid = spr.listItemId
    INNER JOIN systemlistitem sbc ON stud.bestcalltime = sbc.listItemId
    INNER JOIN profile pro ON stud.userid = pro.userid
    INNER JOIN users ON stud.userid = users.userid
    LEFT JOIN userreviews ur ON stud.userid = ur.revieweduserid
WHERE
    stud.id = ${id}
GROUP BY
    stud.id,
    stud.userid,
    pro.poc,
    pro.emailId,
    pro.primaryContact,
    pro.address1,
    pro.address2,
    pro.whatsappNumber,
    pro.gender,
    users.isdcode,
    stud.segmentid,
    seg.name,
    stud.locationid,
    sl.listItemName,
    stud.instructionmedium,
    si.listItemName,
    stud.studentsgroup,
    sgr.listItemName,
    stud.sessionsperweek,
    spw.listItemName,
    stud.budget,
    stud.privacyid,
    spr.listItemName,
    stud.bestcalltime,
    sbc.listItemName,
    stud.requirementdesc,
    stud.gender,
    stud.maritalstatus,
    sm.listItemName,
    stud.agegroup,
    sa.listItemName,
    stud.schoolingpref,
    ss.listItemName;
    `,
    (err, result1) => {
      if (err) {
        result(err, null);
        return;
      }


      sql.query(
        `
        SELECT ur.*, pro.poc AS reviewed_username FROM userreviews ur INNER JOIN profile pro ON ur.userid = pro.userid WHERE ur.revieweduserid = ${result1[0]?.userid};
        `,
        (err, res2) => {
          if (err) {
            result(err, null);
            return;
          }
          
          let query2 = `SELECT ts.id, ts.subjectid, ts.userid, ts.segmentid, sub.name
          FROM teachersubject AS ts
          INNER JOIN subject AS sub ON ts.subjectid = sub.subjectid;
          `;
    
          sql.query(query2, (err, res3) => {
            if (err) {
              result(null, err);
              return;
            }
    
            const matchingResult2 = res3.filter(
              (result2) =>
                result1[0]?.userid == result2.userid &&
                result1[0]?.segmentid == result2.segmentid
            );
    
            const combinedResults = {
              ...result1[0],
              reviews: res2,
              subjects: matchingResult2 ? matchingResult2 : [],
            };
    
    
            result(null, combinedResults);
          });
          
    
          // not found studentlevel with the userid
        }
      );

    }
  );
};

module.exports = studentlevel;

// SELECT *, sg.listItemName AS genPref, sm.listItemName AS martial, sa.listItemName AS agegroup, ss.listItemName AS schooling FROM studentlevel stud INNER JOIN systemlistitem sg ON stud.gender = sg.listItemId INNER JOIN systemlistitem sm ON stud.maritalstatus = sm.listItemId INNER JOIN systemlistitem sa ON stud.agegroup = sa.listItemId INNER JOIN systemlistitem ss ON stud.schoolingpref = ss.listItemId WHERE stud.userid = 174;

// const getAllQuery = `SELECT stud.id, stud.userid, stud.segmentid, seg.name AS segmentName, stud.locationid, sl.listItemName AS locationName, stud.instructionmedium, si.listItemName AS mediumName, stud.studentsgroup, sgr.listItemName AS groupName, stud.sessionsperweek, spw.listItemName AS sessionsName, stud.budget, stud.privacyid, spr.listItemName AS privayName, stud.bestcalltime, sbc.listItemName AS calltimeName, stud.requirementdesc, stud.gender, sg.listItemName AS genPref, stud.maritalstatus, sm.listItemName AS martial, stud.agegroup, sa.listItemName AS agegroup, stud.schoolingpref, ss.listItemName AS schooling FROM studentlevel stud INNER JOIN systemlistitem sg ON stud.gender = sg.listItemId INNER JOIN systemlistitem sm ON stud.maritalstatus = sm.listItemId INNER JOIN systemlistitem sa ON stud.agegroup = sa.listItemId INNER JOIN systemlistitem ss ON stud.schoolingpref = ss.listItemId INNER JOIN segment seg ON stud.segmentid = seg.segmentid INNER JOIN systemlistitem sl ON stud.locationid = sl.listItemId INNER JOIN systemlistitem si ON stud.instructionmedium = si.listItemId INNER JOIN systemlistitem sgr ON stud.studentsgroup = sgr.listItemId INNER JOIN systemlistitem spw ON stud.sessionsperweek = spw.listItemId INNER JOIN systemlistitem spr ON stud.privacyid = spr.listItemId INNER JOIN systemlistitem sbc ON stud.bestcalltime = sbc.listItemId WHERE stud.userid = ${id};`
