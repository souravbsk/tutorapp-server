module.exports = app => {
    const systemlistitem = require("../controllers/systemlistitem.controller.js");
  
    var router = require("express").Router();

    router.get("/", systemlistitem.findAll);
    router.get("/:id", systemlistitem.findOne);
    router.post("/", systemlistitem.create);
    router.put("/:id", systemlistitem.update);
    router.delete("/:id", systemlistitem.delete);
  
 
  
    app.use('/api/systemlistitem', router);
  };
  