module.exports = (app) => {
  const subscriptionplans = require("../controllers/subscriptionplans.controller.js");
  var router = require("express").Router();

  router.post("/", subscriptionplans.create);
  router.get("/", subscriptionplans.findAll);
  router.get("/bystatus", subscriptionplans.findAllByStatus);
  router.put("/update/:id", subscriptionplans.update);
  router.delete("/:id", subscriptionplans.delete);

  app.use("/api/subscriptionplans", router);
};
