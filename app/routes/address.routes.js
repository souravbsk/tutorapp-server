module.exports = (app) => {
    const address = require("../controllers/address.controller.js");
    var router = require("express").Router();
  
    router.post("/", address.create);
    router.get("/:id", address.findOne);
    router.put("/updateByUserId/:id", address.updateAddressByUserId);
    router.delete("/:userid", address.delete);
    app.use("/api/address", router);
  };
  