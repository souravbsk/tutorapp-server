const documents = require("../models/documents.model.js");
const fs = require("fs");
const path = require("path");
const sql = require("../models/db.js");

exports.create = (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const imageFront = req.files["imageFront"][0];
  const imageBack = req.files["imageBack"][0];

  if (!imageFront || !imageBack) {
    return res.status(400).json({
      message: "Both 'Front image ' and ' Back image'f files are required",
    });
  }

  const newDocument = {
    userid: req?.body?.userid,
    documenttype: req?.body?.documenttype,
    documentpathF: req?.files.imageFront[0].path,
    documentpathB: req?.files.imageBack[0].path,
    verifystatus: req?.body?.verifystatus,
  };

  sql.query(
    `SELECT * from documents where userid =${req?.body?.userid}`,
    (err, findRes) => {
      if (findRes[0]?.id) {
        const [a, fontImgPath] = findRes[0]?.documentpathF?.split("\\");
        const [c, backImgPath] = findRes[0]?.documentpathB?.split("\\");

        const filePathFront = `uploads/${fontImgPath}`;
        const filePathBack = `uploads/${backImgPath}`;

        fs.unlink(filePathFront, (err) => {
          if (err) {
            console.error("Error deleting Front file:", err);
          } else {
            fs.unlink(filePathBack, (err) => {
              if (err) {
                console.error("Error deleting back file:", err);
              } else {
                documents.remove(req?.body?.userid, (err, data) => {
                  documents.create(newDocument, (err, result) => {
                    if (err) {
                      return res
                        .status(500)
                        .json({
                          message:
                            "Error occurred while inserting the document",
                        });
                    }
                    res.send({
                      result,
                      message:
                        "File uploaded and document inserted successfully",
                    });
                  });
                });

                console.log("Back File deleted successfully");
              }
            });
            console.log("Front File deleted successfully");
          }
        });
      } else {
        documents.remove(req?.body?.userid, (err, data) => {
          documents.create(newDocument, (err, result) => {
            if (err) {
              return res
                .status(500)
                .json({
                  message: "Error occurred while inserting the document",
                });
            }

            res.send({
              result,
              message: "File uploaded and document inserted successfully",
            });
          });
        });
        console.log("Front File deleted successfully");
      }
    }
  );
};

exports.findAll = (req, res) => {
  documents.findAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving documents.",
      });

    else res.send({success:true,data});
  });
};

exports.findOne = (req, res) => {
  documents.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found documents with userid ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving documents with userid " + req.params.id,
        });
      }
    } else
      res.send({
        success: true,
        data,
      });
  });
};

exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  documents.update(req.params.id, req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found documents with userid ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving documents with userid " + req.params.id,
        });
      }
    } else
      res.send({
        success: true,
        data,
      });
  });
};
