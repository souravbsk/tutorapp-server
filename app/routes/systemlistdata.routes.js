module.exports = app => {
    const systemlistdata = require("../controllers/systemlistdata.contoller");
    var router = require("express").Router();

  
    router.post("/", systemlistdata.create);
    router.get("/:id", systemlistdata.findAll);
    router.delete("/lang-update/:userid/:listid", systemlistdata.delete);
 

app.use('/api/systemlistdata', router);     

};
