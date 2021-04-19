const { jwtSecret } = require("../secrets"); // use this secret!
const jwt = require("jsonwebtoken");

function buildToken(user) {
  console.log(user);
  const payload = {
    subject: user.user_id,
    username: user.username,
    role: user.role_name,
  };
  const config = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, jwtSecret, config);
}

module.exports = {
  buildToken,
};
