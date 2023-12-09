module.exports = (app) => {
    const messagetoteacher = require("../controllers/messagetoteacher.controller")
    var router = require("express").Router();
  
    // router.get("/:id", messagetoteacher.findOne);
    router.post("/", messagetoteacher.create);
    router.get("/:id", messagetoteacher.findAllById);
  
   
  
    app.use("/api/messagetoteacher", router);
  };
  