module.exports = (app) => {
  const documents = require("../controllers/documents.controller.js");

  const multer = require("multer");

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  const upload = multer({ storage: storage });

  var router = require("express").Router();

  // router.post("/upload",upload.single('imageFront'), documents.create);

  router.post(
    "/upload",
    upload.fields([{ name: "imageFront" }, { name: "imageBack" }]),
    documents.create
  );

  
  router.get("/:id", documents.findOne);
  router.get("/", documents.findAll);
  router.put("/update/:id", documents.update);

  app.use("/api/documents", router);
};
