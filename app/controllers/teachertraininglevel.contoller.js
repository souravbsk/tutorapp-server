const teachertraininglevel = require("../models/teachertraininglevel.model");

exports.create = (req, res) => {
  // Validate request
  if (!req.body || !Array.isArray(req.body)) {
    res.status(400).send({
      message: "Request body must be a non-empty array of objects!",
    });
    return;
  }

  // Initialize an array to store the inserted data
  const insertedData = [];
  let processedItems = 0;
  const totalItems = req.body.reduce((total, teachertraininglevelData) => {
    return total + teachertraininglevelData.boards.length;
  }, 0);

  // Loop through the array and insert each segment with its subjects
  req.body.forEach((trainingLevelData) => {
    const { userid, boards, price, segment } = trainingLevelData;

    // Loop through the subjects array and insert each subject
    boards.forEach((board) => {
      const newTeachertraininglevel = new teachertraininglevel({
        userid,
        segmentid: segment,
        board: board,
        price: price,
      });

      teachertraininglevel.create(
        newTeachertraininglevel,
        (teachertraininglevelErr, teachertraininglevelResult) => {
          processedItems++;

          if (teachertraininglevelErr) {
            console.error(
              `Error inserting teachertraininglevel with boardid ${board}: ${teachertraininglevelErr.message}`
            );
          } else {
            insertedData.push(teachertraininglevelResult);

            // Check if all items have been processed

            if (processedItems === totalItems) {
              res.send({ success: true, data: insertedData });
            }
          }
        }
      );
    });
  });
};

// exports.findAll = (req, res) => {
//   teachertraininglevel.getAll(req.params.id, (err, data) => {
//     if (err)
//       res.status(500).send({
//         message:
//           err.message || `Some error occurred while retrieving teachertraininglevel with userid ${req.params.id}.`
//       });
//     else res.send({
//         status:200,
//         success:true,
//         data:data
//     });
//   });
// };

exports.findAll = (req, res) => {
  teachertraininglevel.getAll(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message ||
          `Some error occurred while retrieving teachertraininglevel with userid ${req.params.id}.`,
      });
    } else {
      // Create an object to store the grouped data
      const groupedData = {};

      // Iterate through the data and group it by segment_id and segment_name
      data.forEach((item) => {
        const {
          segmentid,
          segment_name,
          board_name,
          price,
          board_id,
          id,
          userid,
          category_id,
          category_Name,
        } = item;

        // Create a unique key for each group
        const groupKey = `${segmentid}_${segment_name}`;

        // If the group doesn't exist, create an empty array for it
        if (!groupedData[groupKey]) {
          groupedData[groupKey] = {
            id,
            userid,
            segment: segmentid,
            segment_name,
            price,
            category: category_id,
            categoryName: category_Name,
            boardData: [],
            dbstatus: "n",
          };
        }

        // Add the board_name and price to the group's data array
        groupedData[groupKey].boardData.push({
          listItemName: board_name,
          listItemId: board_id,
        });
      });


      // Convert the grouped data object into an array
      const formattedData = Object.values(groupedData);

      res.send({
        status: 200,
        success: true,
        data: formattedData,
      });
    }
  });
};

exports.delete = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
 
  teachertraininglevel.delete(req.params.uid,req.params.lid, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found profile with id ${req.params.id}.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating profile with id " + req.params.id,
          });
        }
      } else
        res.send(data);
    }
  );
};
