const db = require('../utils/connection.js');
const Utente = require('../model/Utente');
require("dotenv").config();
const JwtToken = require('../utils/JwtToken');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

var errorsHandler = (err) => {
    let errors = {  email: ""};
  
    if (err.message === "Utente non aggiornato" ) {
      errors.email = 
        "L'Utente non è riuscito a diventare host";
    }
  
  
    return errors;
};


const become_host_post = async (req,res) => {
    try{
        const id = JwtToken.decodedId(req); 
        var usermail = await Utente.diventaHost(id); //test
        res.status(200).json({message: 'Utente trasformato in Host con successo!', user: usermail});
    } catch (err) {
        const errors = errorsHandler(err);
        res.status(400).json({ errors });
    }
}


module.exports = {become_host_post}; //