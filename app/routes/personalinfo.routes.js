module.exports = (app) => {
    const personalinfo = require("../controllers/personalinfo.controller.js");
    var router = require("express").Router();
    
    router.post("/", personalinfo.create);
    router.get("/byUserId/:id", personalinfo.findOneByUserId);
    router.put("/:id", personalinfo.updatePersonalInfoByUserId);
    

    
    app.use("/api/personalinfo", router);
  };
  