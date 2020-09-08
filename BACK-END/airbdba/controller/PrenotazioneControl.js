const db = require('../utils/connection.js');
const Prenotazione = require('../model/Prenotazione');
const Inserzione = require('../model/Inserzione');
const { Op } = require("sequelize");




const effettua_pren_post = async (req,res) => {
    console.log("Prenotazione in corso..");

    var prova = req.body.prova;

    console.log(prova);
    //COSE DA FARE: CONTROLLO SE HAI FATTO LOGIN
    //              CONTROLLO 28 GIORNI
    //              IDENTIFICAZIONE OSPITI
    //              PAGAMENTO (VABE SIMULATO)
}

module.exports = {effettua_pren_post};