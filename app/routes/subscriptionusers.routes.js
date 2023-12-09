module.exports = (app) => {
    const subscriptionusers = require("../controllers/subscriptionusers.controller.js");
    var router = require("express").Router();
  
    router.post("/", subscriptionusers.create);
    router.get("/:id", subscriptionusers.findOne);
    router.put("/update/:id", subscriptionusers.updateById);

  
    app.use("/api/subscriptionusers", router);
  };
  