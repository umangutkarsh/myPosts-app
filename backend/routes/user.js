const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  //   console.log(req.body);
  let user;
  const salt = bcrypt.genSalt(10);
  bcrypt
    .hash(req.body.password, salt)
    .then((hash) => {
      user = new User({
        email: req.body.email,
        password: hash,
      });
      user.save().then((createdUser) => {
        res
          .status(201)
          .json({ message: "User registered successfully", user: createdUser });
      });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Could not create user", error: err.message });
    });
});

module.exports = router;
