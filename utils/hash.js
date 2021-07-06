const crypto = require("crypto");

function generateSalt(len) {
  return crypto.randomBytes(len).toString("hex").slice(0, len);
}

function encryptPassword(password, salt) {
  const hash = crypto.createHmac("sha512", salt);
  hash.update(password);
  const value = hash.digest("hex");
  return {
    salt: salt,
    passwordHash: value,
  };
}

exports.hashPassword = (userpassword) => {
  return encryptPassword(userpassword, generateSalt(8));
};
