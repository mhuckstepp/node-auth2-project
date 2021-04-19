const router = require("express").Router();
const { checkUsernameExists, validateRoleName } = require("./auth-middleware");
const { jwtSecret } = require("../secrets");
const bcryptjs = require("bcryptjs");
const { add } = require("../users/users-model");
const { buildToken } = require("./tokenBuilder");

router.post("/register", validateRoleName, (req, res, next) => {
  const credentials = req.body;

  const hash = bcryptjs.hashSync(credentials.password, 10);

  credentials.password = hash;

  add(credentials)
    .then((user) => {
      const token = buildToken(user);
      res.status(201).json({ message: "welcome", token: token });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.post("/login", checkUsernameExists, (req, res, next) => {
  res
    .status(200)
    .json({
      message: `${req.body.founduser.username} is back!`,
      token: "Tokeeeeey",
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
});

module.exports = router;
