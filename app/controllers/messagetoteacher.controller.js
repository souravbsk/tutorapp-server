const messagetoteacher = require("../models/messagetoteacher.model");

exports.create = async (req, res) => {
  // Validate request
  if (
    !req.body ||
    !req.body.locationid ||
    !Array.isArray(req.body.locationid)
  ) {
    res.status(400).send({
      message: "Invalid request. Location IDs must be provided as an array.",
    });
    return;
  }

  const insertPromises = req.body.locationid.map((item) => {
    const newMsg = new messagetoteacher({
      userid: req.body.userid,
      senderid: req.body.senderid,
      messagetitle: req.body.messagetitle,
      segmentid: req.body.segmentid,
      subjectid: req.body.subjectid,
      locationid: item,
      description: req.body.description,
      budget: req.body.budget || false,
    });

    return new Promise((resolve, reject) => {
      messagetoteacher.create(newMsg, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  });

  try {
    const results = await Promise.all(insertPromises);
    res.send({ success: true, data: results });
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        "Some error occurred while creating the messagetoteacher.",
    });
  }
};

exports.findAllById = (req, res) => {
  messagetoteacher.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found messagetoteacher with senderid ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message:
            "Error retrieving messagetoteacher with senderid " + req.params.id,
        });
      }
    } else {
      const result = data.reduce((acc, item) => {
        // Check if the userid key already exists
        if (!acc[item.userid]) {
          // If not, create a new object with the initial values
          acc[item.userid] = {
            userid: item.userid,
            senderid: item.senderid,
            messagetitle: item.messagetitle,
            segmentid: item.segmentid,
            segmentname: item.segmentname,
            subjectid: item.subjectid,
            subjectname: item.subjectname,
            description: item.description,
            receivedate: item.receivedate,
            budget: item.budget,
            locationname: [
              { locationid: item.locationid, name: item.locationname },
            ], // Initialize an array with the first locationname
          };
        } else {
          // If the userid key already exists, push a new object with locationid and locationname to the array
          acc[item.userid].locationname.push({
            locationid: item.locationid,
            name: item.locationname,
          });
        }

        return acc;
      }, {});

      // Convert the result object to an array of objects
      const finalResult = Object.values(result);

      res.send(finalResult);
    }
  });
};
