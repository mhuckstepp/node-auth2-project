const router = require("express").Router();
const { checkUsernameExists, validateRoleName } = require("./auth-middleware");
const bcrypt = require("bcryptjs");
const { add } = require("../users/users-model");
const { buildToken } = require("./tokenBuilder");

router.post("/register", validateRoleName, (req, res, next) => {
  const credentials = req.body;

  const hash = bcrypt.hashSync(credentials.password, 10);

  credentials.password = hash;

  add(credentials)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.post("/login", checkUsernameExists, (req, res, next) => {
  const user = req.body.foundUser;
  const { username, password } = req.body;

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = buildToken(user);
    res.status(200).json({
      message: `${username} is back!`,
      token: token,
    });
  } else {
    res.status(401).json({
      message: "invalid credentials on login router",
    });
  }
});
/**
    [POST] /api/auth/login { "username": "sue", "password": "1234" }

    response:
    status 200
    {
      "message": "sue is back!",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ETC.ETC"
    }

    The token must expire in one day, and must provide the following information
    in its payload:

    {
      "subject"  : 1       // the user_id of the authenticated user
      "username" : "bob"   // the username of the authenticated user
      "role_name": "admin" // the role of the authenticated user
    }
   */

module.exports = router;
