const db = require('../utils/connection.js');
const Utente = require('../model/Utente');
//var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

//TODO: SOSTITUIRE TUTTI i messaggi con attributo "message"

exports.registrazione = (req,res) => {

    console.log("Registrazione in corso...");

    Utente.findOne({
        where: {
            email: req.body.email
        }
    }).then(utente => {
        if(utente) {
            return res.status(400).send('questa email è già stata utilizzata');
        } else {
            Utente.create({
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 8),
                nome: req.body.nome,
                cognome: req.body.cognome,
                indirizzo: req.body.indirizzo,
                data_nascita: req.body.datanascita,
                numero_telefonico: req.body.numerotel
            }).then(utente => {
                return res.status(200).send('account registrato con successo!');
            }).catch(err => {
                return res.status(500).send("Errore! -> " + err);
            })
        }
    }).catch(err =>{
        return res.stat(500).send("Errore! -> " + err);
    });   
}

