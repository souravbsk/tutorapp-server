module.exports = (app) => {
    const studentpersonalinfo = require("../controllers/studentpersonalinfo.controller.js");
    var router = require("express").Router();
  
    
    router.get("/:id", studentpersonalinfo.findOne);
    router.post("/", studentpersonalinfo.create);
    router.put("/:id", studentpersonalinfo.update);
   
    app.use("/api/studentpersonalinfo", router);
  };  
  