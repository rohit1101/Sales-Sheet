const jwt = require("jsonwebtoken");

exports.createToken = (id) => {
  return jwt.sign({ id }, "loki- god of mischief");
};

exports.verifyToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (typeof authorization !== "undefined") {
    const token = authorization.split(" ")[1];
    jwt.verify(token, "loki- god of mischief", (err, decoded) => {
      if (err) {
        res.status(403).json("Forbidden");
      } else {
        next();
      }
    });
  } else {
    res.status(403).json("Forbidden");
  }
};
