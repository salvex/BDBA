const jwt = require('jsonwebtoken');
const db = require('./connection');
const Utente = require('../model/Utente');
//MIDDLEWARE JWTs

const verifyToken = (req, res, next) => {
    //let token = req.headers['x-access-token'];
    let token = req.cookies.jwt;

    if(!token) {
        return res.status(403).send({
            auth: false, message: 'Nessun token fornito'
        });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if(err) {
            return res.status(500).send({
                auth: false,
                message: 'Errore autenticazione: ' + err
            });
        }
        req.id = decoded.id;
        next();
    })
}

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
  return jwt.sign({ id: userid }, process.env.TOKEN_SECRET, { expiresIn: maxAge });
};


module.exports = {verifyToken,createToken,checkUser};
