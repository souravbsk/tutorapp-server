module.exports = app => {
    const role = require("../controllers/role.controller.js");
  
    var router = require("express").Router();
  
  
    // Retrieve all Tutorials
    router.get("/", role.findAll);
    app.use('/api/role', router);
};