const express = require("express");
const app = express();

const cors = require("cors");

var corsOptions = {
  origin: "http://localhost:5173",
};

// app.use(cors(corsOptions));
app.use(cors());

app.use(express.json());


app.use(
  express.urlencoded({ extended: true })
); 

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to apnabyte server site." });
});

require("./app/routes/profile.routes.js")(app);
require("./app/routes/role.routes.js")(app);
require("./app/routes/category.routes.js")(app);
require("./app/routes/users.routes.js")(app);
require("./app/routes/segment.routes.js")(app);
require("./app/routes/subject.routes.js")(app);
require("./app/routes/systemlist.routes.js")(app);
require("./app/routes/systemlistitem.routes.js")(app);
require("./app/routes/systemlistdata.routes.js")(app);
require("./app/routes/teachereducation.routes.js")(app);
require("./app/routes/teacherproficiency.routes.js")(app);
require("./app/routes/teachertraininglevel.routes.js")(app);
require("./app/routes/teacherschooling.routes.js")(app);
require("./app/routes/teachersubject.routes.js")(app);
require("./app/routes/teacherschooling.routes.js")(app);
require("./app/routes/personalinfo.routes.js")(app);
require("./app/routes/address.routes.js")(app);
require("./app/routes/studentpersonalinfo.routes.js")(app);
require("./app/routes/studentlevel.routes.js")(app);
require("./app/routes/documents.routes.js")(app);
require("./app/routes/subscriptionplans.routes.js")(app);
require("./app/routes/subscriptionusers.routes.js")(app);
require("./app/routes/contactsviewed.routes.js")(app);
require("./app/routes/userreviews.routes.js")(app);
require("./app/routes/messagetoteacher.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

app.use("/uploads",express.static('uploads'))