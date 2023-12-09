module.exports = (app) => {
  const teachereducation = require("../controllers/teachereducation.controller.js");
  var router = require("express").Router();
  router.post("/", teachereducation.create);
  router.delete("/:id", teachereducation.delete);
  router.post('/updateTeacherEducation', teachereducation.updateOrInsert);
  app.use("/api/teachereducation", router);
};
