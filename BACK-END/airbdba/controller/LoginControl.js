const db = require('../utils/connection.js');
const Utente = require('../model/Utente');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');


exports.login = (req,res) => {
    console.log('Login in corso');

    Utente.findOne({
        where: {
            email: req.body.email
        }
    }).then(utente => {
        if(!utente) {

        }
    })
}