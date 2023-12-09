module.exports = app => {
    const category = require("../controllers/category.controller.js");
  
    var router = require("express").Router();
  
  
    // Retrieve all Tutorials
    router.get("/", category.findAll);
    app.use('/api/category', router);
};
