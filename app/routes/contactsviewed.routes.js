module.exports = (app) => {
  const contactsviewed = require("../controllers/contactsviewed.controller")
  var router = require("express").Router();


  router.get("/:id", contactsviewed.findOne);
  router.post("/", contactsviewed.create);

 

  app.use("/api/contactsviewed", router);
};
