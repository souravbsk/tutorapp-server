const multer = require("multer");

module.exports = (app) => {
  const profile = require("../controllers/profile.controller.js");
  var router = require("express").Router();




  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });


  const upload = multer({ storage: storage });

  router.put(
    "/upload/:id",
    upload.single("profileimage"),profile.imageupload
  );



  router.get("/", profile.findAll);
  router.get("/:id", profile.findOne);
  router.get("/byUserId/:id", profile.findOneByUserId);
  router.post("/", profile.create);
  router.delete("/:id", profile.delete);
  router.put("/:id", profile.update);

  app.use("/api/profile", router);
};
