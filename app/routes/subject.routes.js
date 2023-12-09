module.exports = app => {
    const subject = require("../controllers/subject.controller.js");
  
    var router = require("express").Router();


router.post("/", subject.create); 
router.get("/:id", subject.findOne);
router.get("/", subject.findAll);
router.get("/bysegment/:id", subject.findSubjectBySegmentId);
router.put("/:id", subject.update);
router.delete("/:id", subject.delete);
  


app.use('/api/subject', router);
};
