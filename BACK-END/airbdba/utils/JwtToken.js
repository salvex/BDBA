const jwt = require("jsonwebtoken");
const db = require("./connection");
const Utente = require("../model/Utente");
//MIDDLEWARE JWTs

const verifyToken = (req, res, next) => {
  //let token = req.headers['x-access-token'];
  let token = req.cookies.jwt;

  if (!token) {
    /*return res.status(403).send({
      auth: false,
      message: "Nessun token fornito",
    });*/
    res.redirect("/login");
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).send({
        auth: false,
        message: "Errore autenticazione: " + err,
      });
    }
    next();
  });
};

const verifyHost = (req, res, next) => {
  let token = req.cookies.host;

  if (!token) {
    /*return res.status(403).send({
      isHost: false,
      message: "Nessun token fornito",
    });*/
    res.redirect("/");
  }

  jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(500).send({
        isHost: false,
        message: "Errore autenticazione " + err,
      });
    }
    next();
  });
};

const decodedId = (req) => {
  var userId;
  const token = req.cookies.jwt;

  if (!token) {
    console.log("errore");
    userId = null;
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
    } else {
      userId = decoded.id;
    }
  });
  return userId;
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        console.log(err);
        next();
      } else {
        try {
          const user = await Utente.findOne({ where: { id: decodedToken.id } });
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

const maxAge = 60 * 60 * 24;
const createToken = (userid) => {
  return jwt.sign({ id: userid }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};
const createTokenHost = (userid) => {
  return jwt.sign({ isHost: 1, id: userid }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports = {
  verifyToken,
  verifyHost,
  createToken,
  createTokenHost,
  checkUser,
  decodedId,
};
