module.exports = (app) => {
  const segment = require("../controllers/segment.controller.js");

  var router = require("express").Router();

  // Retrieve a single segment with id
  router.get("/", segment.findAll);
  router.post("/", segment.create);
  router.get("/:id", segment.findOne);
  router.get("/bycategory/:id", segment.findsegmentByCategoryId);
  router.put("/:id", segment.updateSegmentBySegmentId);
  router.delete("/:id", segment.delete);
  app.use("/api/segment", router);
};
