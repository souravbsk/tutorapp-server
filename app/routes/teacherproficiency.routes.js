module.exports = (app) => {
  const teacherproficiency = require("../controllers/teacherproficiency.controller.js");

  var router = require("express").Router();

  router.post("/", teacherproficiency.create);
  router.get("/:id", teacherproficiency.findOne);
  router.put("/:id", teacherproficiency.updateTeacherProfeciencyByuserId);

  app.use("/api/teacherproficiency", router);
};
