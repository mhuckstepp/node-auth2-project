const { jwtSecret } = require("../secrets"); // use this secret!
const jwt = require("jsonwebtoken");
const { default: jwtDecode } = require("jwt-decode");
const { findBy } = require("../users/users-model");
const e = require("express");

const restricted = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({
      message: "Token required",
    });
  }

  // else { jwt.verify( token )  }

  //   If the provided token does not verify:
  //   status 401
  //   {
  //     "message": "Token invalid"
  //   }

  //   Put the decoded token in the req object, to make life easier for middlewares downstream!
};

const only = (role_name) => (req, res, next) => {
  /*
    If the user does not provide a token in the Authorization header with a role_name
    inside its payload matching the role_name passed to this function as its argument:
    status 403
    {
      "message": "This is not for you"
    }

    Pull the decoded token from the req object, to avoid verifying it again!
  */
};

const checkUsernameExists = (req, res, next) => {
  const username = req.body.username;
  findBy({ username: username })
    .then((user) => {
      if (user) {
        req.body.founduser = user;
        next();
      } else {
        res.status(404).json({ message: "Invalid credentials" });
      }
    })
    .catch(next);
  /*
    If the username in req.body does NOT exist in the database
    status 401
    {
      "message": "Invalid credentials"
    }
  */
};

const validateRoleName = (req, res, next) => {
  const role = req.body.role_name.trim();

  if (!role) {
    req.body.role_name = "student";
    next();
  } else if (role === "admin") {
    res.status(422).json({
      message: "Role name can not be admin",
    });
  } else if (role.length > 32) {
    res
      .status(422)
      .json({ message: "Role name can not be longer than 32 chars" });
  } else {
    next();
  }
};

/*
    If the role_name in the body is valid, set req.role_name to be the trimmed string and proceed.

    If role_name is missing from req.body, or if after trimming it is just an empty string,
    set req.role_name to be 'student' and allow the request to proceed.

    If role_name is 'admin' after trimming the string:
    status 422
    {
      "message": "Role name can not be admin"
    }

    If role_name is over 32 characters after trimming the string:
    status 422
    {
      "message": "Role name can not be longer than 32 chars"
    }
  */

module.exports = {
  restricted,
  checkUsernameExists,
  validateRoleName,
  only,
};
