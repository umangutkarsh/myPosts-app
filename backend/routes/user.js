const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  //   console.log(req.body);

  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then((createdUser) => {
        res.status(201).json({
          message: "User registered successfully",
          result: createdUser,
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      fetchedUser = user;
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((userExists) => {
      if (!userExists) {
        return res.status(401).json({ message: "Auth failed" });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "my_secret_key",
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({ token: token, expiresIn: 3600 });
    })
    .catch((err) => {
      return res
        .status(401)
        .json({ message: "Auth failed", error: err.message });
    });
});

module.exports = router;
