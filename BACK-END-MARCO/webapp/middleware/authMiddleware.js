const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "mysupersecret", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "mysupersecret", async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        console.log(err);
        next();
      } else {
        try {
          console.log(decodedToken.id);
          const user = await User.findOne({ where: { id: decodedToken.id } });
          res.locals.user = user;
          next();
        } catch (err) {
          console.log(err.message);
        }
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};
module.exports = { requireAuth, checkUser };
