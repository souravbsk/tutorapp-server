module.exports = (app) => {
  const teacherschooling = require("../controllers/teacherschooling.controller");
  var router = require("express").Router();

  router.post("/", teacherschooling.create);
  router.get("/:id", teacherschooling.findOne);
  router.put("/", teacherschooling.update);
  app.use("/api/teacherschooling", router);
};
