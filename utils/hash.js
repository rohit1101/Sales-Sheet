const bcrypt = require("bcrypt");

exports.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  return {
    salt,
    hashedPassword,
  };
};

exports.decryptPassword = async (password, passwordHash) => {
  return await bcrypt.compare(password, passwordHash);
};
