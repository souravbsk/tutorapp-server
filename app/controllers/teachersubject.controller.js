const {
  teachersubject,
  studentSubject,
} = require("../models/teachersubject.model"); // Correct the import statement

// ==========for inserting teacher subjects================
exports.create = (req, res) => {
  // Validate request
  
  if (!req.body || !Array.isArray(req.body)) {
    res.status(400).send({
      message: "Request body must be a non-empty array of objects!",
    });
    return;
  }

  const insertedData = [];
  let processedItems = 0;
  const totalItems = req.body.reduce((total, segmentData) => {
    return total + segmentData.subjects.length;
  }, 0);

  req.body.forEach((segmentData) => {
    const { userid, segment, subjects } = segmentData;

    subjects.forEach((subjectid) => {
      const newTeacherSubject = new teachersubject({
        // Use correct model name
        userid,
        segmentid: segment,
        subjectid,
      });

      teachersubject.create(newTeacherSubject, (subjectErr, subjectResult) => {
        // Use correct model name
        processedItems++;
        if (subjectErr) {
          console.error(
            `Error inserting subject with subjectid ${subjectid}: ${subjectErr.message}`
          );
        } else {
          insertedData.push(subjectResult);

          if (processedItems === totalItems) {
            res.send({ success: true, data: insertedData });
          }
        }
      });
    });
  });
};



// exports.findOne = (req, res) => {
//   teachersubject.findById(req.params.id, (err, data) => {
//     if (err) {
//       if (err.kind === "not_found") {
//         res.status(404).send({
//           message: `Not found teachersubject with userid ${req.params.id}.`,
//         });
//       } else {
//         res.status(500).send({
//           message: "Error retrieving teachersubject with userid " + req.params.id,
//         });
//       }
//     } else res.send(data);
//   });
// };

exports.findOne = (req, res) => {
  teachersubject.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found teachersubject with userid ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving teachersubject with userid " + req.params.id,
        });
      }
    } else {
      const groupedData = {};

      data.forEach(item => {
        if (!groupedData[item.segmentid]) {
          groupedData[item.segmentid] = [];
        }
        groupedData[item.segmentid].push({subject_name:item.name,subject_id:item.subjectid,subject_primarykey: item?.id});
      });

      res.send(groupedData);
    }
  });
};

exports.findOneById = (req, res) => {
  teachersubject.findOneById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found teachersubject with userid ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving teachersubject with userid " + req.params.id,
        });
      }
    } else {
      res.send(data);
    }
  });
};




exports.updateByUserId = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  teachersubject.updateByUserId( req.params.id, (req.body), (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found teachersubject with userid ${req.params.id}.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating teachersubject with userid " + req.params.id,
          });
        }
      } else res.send(data);
    }
  );
};



// ==========for inserting student subjects================
exports.studentcreate = (req, res) => {
 

  // Validate request
  if (!req.body.userid || !req.body.segmentid || !req.body.subjectid) {
    res.status(400).send({
      message: "Request body must contain userid, segmentid, and subjectid",
    });
    return;
  }

  const { userid, segmentid, subjectid } = req.body;

  const insertedData = [];
  let processedItems = 0;
  const totalItems = subjectid.length;

  subjectid.forEach((subjectId) => {
    const newStudentSubject = {
      userid,
      segmentid,
      subjectid: subjectId,
    };

    studentSubject.studentcreate(
      newStudentSubject,
      (subjectErr, subjectResult) => {
        processedItems++;

        if (subjectErr) {
          console.error(
            `Error inserting subject with subjectid ${subjectId}: ${subjectErr.message}`
          );
        } else {
          insertedData.push(subjectResult);

          if (processedItems === totalItems) {
            res.send({ success: true, data: insertedData });
          }
        }
      }
    );
  });
};