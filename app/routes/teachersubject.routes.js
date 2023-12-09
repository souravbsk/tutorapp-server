module.exports = (app) => {
  const teachersubject = require("../controllers/teachersubject.controller.js");
  const studentSubject = require("../controllers/teachersubject.controller.js");

  var router = require("express").Router();

  router.post("/", teachersubject.create);
  router.get("/:id", teachersubject.findOne);
  router.get("/findbyid/:id", teachersubject.findOneById);
  router.put("/:id", teachersubject.updateByUserId);

  // For inserting student subject
  router.post("/studentSubject", studentSubject.studentcreate);

  app.use("/api/teachersubject", router);
};