module.exports = app => {
    const systemlist = require("../controllers/systemlist.controller.js");
  
    var router = require("express").Router();


    router.get("/", systemlist.findAll);
    router.get("/:id", systemlist.findOne);
    router.post("/", systemlist.create);
    router.put("/:id", systemlist.update);
    router.delete("/:id", systemlist.delete);
  

  
    app.use('/api/systemlist', router);
  };
  