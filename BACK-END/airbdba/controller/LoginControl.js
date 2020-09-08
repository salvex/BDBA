const db = require('../utils/connection.js');
const Utente = require('../model/Utente');
require("dotenv").config();
const JwtToken = require('../utils/JwtToken');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

const maxAge = 60 * 60 * 24;

var errorsHandler = (err) => {
    let errors = {  email: "", password: ""};
  
    if (err.message === "email errata" || err.message === "password errata") {
      errors.email = errors.password =
        "Credenziali di accesso errate o inesistenti";
    }
  
    if (err.message.includes("Validation error")) {
      Object.values(err.errors).forEach((error) => {
        errors[error.path] = error.message;
      });
    }
  
    return errors;
  };



//TODO: SOSTITUIRE TUTTI i messaggi res.send con l'attributo "reason"

/*const login_post = (req,res) => {
    console.log('Login in corso');
    
    Utente.findOne({
        where: {
            email: req.body.email
        }
    }).then(utente => {
        if(!utente) {
            return res.status(404).send({ reason: 'Utente non trovato'});
        }

        var passwordIsValid = bcrypt.compareSync(req.body.password,utente.password);
        if(!passwordIsValid) {
            return res.status(401).send({ auth: false, accessToken: null, reason: 'Password non corretta!'});
        }

        //TOKEN JWT
       var token = jwt.sign({ id: utente.id}, process.env.TOKEN_SECRET, {
            expiresIn: 84600 //scade in 24 ore
        }); 
        var token = JwtToken.createToken(utente.id);
        //return res.header('x-access-token', token).send({message : 'Hai effettuato il login!', auth: true, accessToken: token});
        return res.cookie("jwt", token, { httpOnly: true, expiresIn: maxAge * 1000}).send({message : 'Hai effettuato il login!', auth: true, accessToken: token});
    }).catch(err => {
        return res.status(500).send({ reason: err.message});
    })
};*/ 

const login_post = async (req,res) => {
    try {
        var utente = await Utente.Autentica2(req.body.email, req.body.password);
        var token = JwtToken.createToken(utente.id);
        res.cookie("jwt", token, { httpOnly: true, expiresIn: maxAge * 1000});
        res.status(200).json({message: 'Login effettuato con successo!'});
    } catch (err) {
        const errors = errorsHandler(err);
        res.status(400).json({ errors });
    }
}


/*const login_get = (req, res) => {
    const token = req.cookies.jwt;
    if (token) {
      res.status(200).send({token : token});
    }
    res.status(400).send({message : 'Utente non autenticato'});
};*/
  



module.exports = {login_post};
