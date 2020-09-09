const db = require('../utils/connection.js');
const Utente = require('../model/Utente');
require("dotenv").config();
const JwtToken = require('../utils/JwtToken');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

const maxAge = 60 * 60 * 24;


const logout_get = (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.cookie("host", "", { maxAge: 1 });
    //req.app.set("user", {});
    //res.send(req.id);
    res.send({message: 'Logout effettuato con successo'});
    res.render('/');
  };


module.exports = {logout_get};