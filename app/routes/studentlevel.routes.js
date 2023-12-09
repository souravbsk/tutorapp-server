module.exports = (app) => {
  const studentlevel = require("../controllers/studentlevel.controller.js");
  var router = require("express").Router();

  router.get("/", studentlevel.findAll);
  router.post("/", studentlevel.create);
  router.get("/:id", studentlevel.findOne);
  router.get("/findbyid/:id", studentlevel.findStudentid);
  router.get("/findallbyid/:id", studentlevel.findAllById);
  router.put("/:id", studentlevel.updateStudentlevelByUserId);

  app.use("/api/studentlevel", router);
};
