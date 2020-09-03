const db = require('../utils/connection.js');
const Utente = require('../model/Utente');
const dotenv = require('dotenv');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');


//TODO: SOSTITUIRE TUTTI i messaggi res.send con l'attributo "reason"

exports.login = (req,res) => {
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
            expiresIn: 86400 //scade in 24 ore
        })
        res.header('auth-token', token).send(token);
        return res.status(200).send({message: 'Utente loggato con successo!'});
    }).catch(err => {
        res.status(500).send({ reason: err.message})
    })
}