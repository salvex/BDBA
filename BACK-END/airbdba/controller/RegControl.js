const db = require('../utils/connection.js');
const Utente = require('../model/Utente');
//var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

//TODO: SOSTITUIRE TUTTI i messaggi res.send con l'attributo "message"
errorsHandler = (err) => {
    let errors = { nome: "", cognome: "", email: "", password: "", indirizzo: "", data_nascita: "", numero_telefonico: ""};
  
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
            /*    indirizzo: req.body.indirizzo, //
                data_nascita: req.body.datanascita,
                numero_telefonico: req.body.numerotel */
            }).then(utente => {
                return res.status(200).send('account registrato con successo!');
            }).catch(err => {
                return res.status(500).send("Errore! -> " + err);
            })
        }
    }).catch(err =>{
        const errors = errorsHandler(err);
        return res.status(500).json(errors);
    });   
}

