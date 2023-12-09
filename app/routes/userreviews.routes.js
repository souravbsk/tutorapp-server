module.exports = (app) => {
  const userreviews = require("../controllers/userreviews.controller");
  const router = require("express").Router();

  router.put("/", userreviews.create);
  router.get("/:userid", userreviews.findAll);

  app.use("/api/userreviews", router);
};
