module.exports = app => {
    const teachertraininglevel = require("../controllers/teachertraininglevel.contoller");
  
    var router = require("express").Router();
  
router.post("/", teachertraininglevel.create);
router.get("/:id", teachertraininglevel.findAll);

// TO DO
router.delete("/delete/:uid/:lid", teachertraininglevel.delete);



app.use('/api/teachertraininglevel', router);
};
