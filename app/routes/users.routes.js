const authenticationMiddleware = require("../middleware/authentication.js");

module.exports = (app) => {
  const users = require("../controllers/users.controller.js");
  var router = require("express").Router();

  // Retrieve a single users with id
  router.get("/", users.findAll);
  router.get("/checkAuth", authenticationMiddleware, users.checkAuth);

  router.get("/:id", users.findOne);
  router.get("/find-teachers-by-role/:id", users.findAllByRoleid);
  router.get("/find-teachers-by-userid/:id", users.findAllByUserid);
  router.get("/findallbyrole/:id", users.findAllTeachersByRole);
  router.get("/mobile/:id", users.duplicateMobileNo);
  router.get("/email/:id", users.duplicateEmail);
  router.get("/:email/:mobile", users.duplicateChecker);
  router.post("/", users.create);
  router.delete("/:id", users.delete);
  router.put("/:id", users.update);
  router.put("/updateByUserId/:id", users.updateUsersByUserId);
  router.put("/updateMobileEmail/:id", users.updateMobileEmailById);
  router.post("/login", users.login);
  router.post("/checkpassword/:id", users.checkPassword);
  router.put("/updatepassword/:id", users.updatePassword);
  router.get("/sendmessagedetails/:id",users.sendmessagedetails)
  app.use("/api/users", router);
};
