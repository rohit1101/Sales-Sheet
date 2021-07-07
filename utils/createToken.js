const jwt = require("jsonwebtoken");

exports.createToken = (id) => {
  return jwt.sign({ id }, "loki- god of mischief", { expiresIn: "2 Days" });
};
