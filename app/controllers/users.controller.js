const users = require("../models/users.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

exports.findAll = (req, res) => {
  users.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    else res.send(data);
  });
};


exports.findOne = (req, res) => {
  users.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found users with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving users with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

exports.findAllByRoleid = (req, res) => {
  users.findUserByRoleid(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found users with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving users with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};


exports.findAllByUserid = (req, res) => {
  const teachingLocationId = req.query?.locationId;
  const laguageId = req.query?.languageId;
  users.findUserByUserid(req.params.id,teachingLocationId,laguageId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found users with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving users with id " + req.params.id,
        });
      }
    } else {

      res.send(data);
    }
  });
};


exports.findAllTeachersByRole = (req, res) => {
  
  users.findAllUsersByRoleId(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found teachers with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving teachers with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};


exports.duplicateMobileNo = (req, res) => {
  users.duplicateMobileNo(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found users with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving users with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

exports.duplicateEmail = (req, res) => {
  users.duplicateEmail(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found users with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving users with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

exports.duplicateChecker = (req, res) => {
  users.duplicateChecker(new users(req.params), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.send({
          message: `Not found users with data ${req.params.email} and ${req.params.mobile}`,
          exist: false,
        });
      } else {
        res.status(500).send({
          message:
            "Error retrieving users with data" +
            req.params.email +
            req.params.mobile,
        });
      }
    } else res.send({ ...data, exist: true });
  });
};

exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(req.body.password, salt);

  const newUsers = new users({
    isdcode: req.body.isdcode,
    mobile: req.body.mobile,
    email: req.body.email,
    password: secPass, // Store the hashed password
    roleid: req.body.roleid || false,
  });

  // Save Users in the database
  users.create(newUsers, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the users.",
      });
    else {
      if (data) {
        const token = jwt.sign(
          { userId: data?.id, role: req?.body?.roleid },
          process.env.ACCESSS_TOKEN_SECRET
        );
        const tokenData = {
          
          token,
          userId: data?.id,
          roleid: data?.roleid
        };
        return res.json({ tokenData, data, success: true});
      }
    }
  });
};

// Delete a users with the specified id in the request
exports.delete = (req, res) => {
  users.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found users with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete users with id " + req.params.id,
        });
      }
    } else res.send({ message: `users was deleted successfully!` });
  });
};

// Update a users identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  users.updateById(req.params.id, req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found users with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating users with id " + req.params.id,
        });
      }
    } else
      res.send({
        success: true,
        data,
      });
  });
};

exports.updateUsersByUserId = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  users.updateByUserId(req.params.id, req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found users with userid ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating users with userid " + req.params.id,
        });
      }
    } else
      res.send({
        success: true,
        data,
      });
  });
};

exports.updateMobileEmailById = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  users.updateMobileEmailById(req.params.id, req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found users with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating users with id " + req.params.id,
        });
      }
    } else
      res.send({
        success: true,
        data,
      });
  });
};

exports.login = async (req, res) => {
  const { email, mobile, password } = req.body;
  users.findByEmailOrMobile(email, mobile, async (err, user) => {
    if (err) {
      console.error("Error retrieving user:", err);
      res.status(500).json({ message: "Error retrieving user" });
      return;
    }
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res
        .status(400)
        .json({ error: "Please try logging in with correct credentials" });
    }

    if (passwordCompare) {
      const token = jwt.sign(
        { userId: user.userid, role: user.roleid },
        process.env.ACCESSS_TOKEN_SECRET
      );
      return res.json({
        success: true,
        token,
        userId: user.userid,
        roleid: user.roleid,
      });
    }
    // Compare the input password with the hashed password
  });
};

exports.checkAuth = (req, res) => {
  const { userId, role } = req.decoded;

  users.findUsersByEmailRoleId(userId, role, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found users with userid = ${userId} and roleid = ${role}.`,
        });
      } else {
        res.status(500).send({
          message: `Error retrieving users with userid = ${userId} and roleid = ${role}. `,
        });
      }
    } else {
      res.send(data);
    }
  });

  // You can access user information like decoded.userId, decoded.role, etc.

  // Perform any additional actions or return a response as needed.
};

exports.checkPassword = async (req, res) => {
  const userId = req.params.id;
  const { oldPass, newPass, conNewPass } = req.body;

  users.findPassword(userId, async (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found users with userid = ${userId} `,
        });
      } else {
        res.status(500).send({
          message: `Error retrieving users with userid = ${userId} `,
        });
      }
    } else {
      const passwordCompare = await bcrypt.compare(oldPass, data.password);
      if (!passwordCompare) {
        return res.status(400).json({ isSamePassword: passwordCompare });
      }
      res.send({
        isSamePassword: passwordCompare,
      });
    }
  });
};

exports.updatePassword = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  users.updateUsersPassword(req.params.id, req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found users with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating users with id " + req.params.id,
        });
      }
    } else
      res.send({
        success: true,
        data,
      });
  });
};



exports.sendmessagedetails = (req, res) => {
  users.sendmessageusersdetailsbyid(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found users with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving users with id " + req.params.id,
        });
      }
    } else {
      console.log(data);

      res.send(data);
    }
  });
};