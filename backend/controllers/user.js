const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const createUser = (req, res, next) => {
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
        console.log(err);
        res.status(500).json({ message: "Invalid authentication credentials" });
      });
  });
};

const loginUser = async (req, res, next) => {
  let fetchedUser;
  await User.findOne({ email: req.body.email })
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
      res
        .status(200)
        .json({ token: token, expiresIn: 3600, userId: fetchedUser._id });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(401)
        .json({ message: "Invalid authentication credentials" });
    });
};

exports.createUser = createUser;
exports.loginUser = loginUser;