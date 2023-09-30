const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log(req);
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "my_secret_key");
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed" });
  }
};
