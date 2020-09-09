const db = require('../utils/connection.js');
const Utente = require('../model/Utente');
const Inserzione = require('../model/Inserzione');
require("dotenv").config();
const JwtToken = require('../utils/JwtToken');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

const maxAge = 60 * 60 * 24;


var errorsHandler = (err) => {
    let errors = {  email: "", query: ""};
  
    if (err.message === "Utente non aggiornato" ) {
      errors.email = 
        "L'Utente non è riuscito a diventare host";
    } else if (err.message === "query vuota") {
        errors.query = 
        "L'inserimento non è andato a buon termine"
    } else if (err.message === "Nessuna inserzione") {
        errors.query =
        "Nessuna inserzione creata"
    }
  
  
    return errors;
};

async function parseField(NomeFilter ,CittàFilter,CheckInFilter,CheckOutFilter,nOspitiFilter,DescFilter,PrezzoFilter,IdFilter) {
    
    const query = [];

    if (NomeFilter  || CittàFilter || CheckInFilter || CheckOutFilter || nOspitiFilter || PrezzoFilter || DescFilter  ) {
        if (NomeFilter ) {
            query.push(NomeFilter)
        }
        if (CittàFilter) {
            query.push(CittàFilter)
        }
        if (CheckInFilter) {
            query.push(CheckInFilter)
        }
        if (CheckOutFilter) {
            query.push(CheckOutFilter)
        }
        if (nOspitiFilter) {
            query.push(nOspitiFilter)
        }
        if (DescFilter) {
            query.push(DescFilter)
          }
        if (PrezzoFilter) {
            query.push(PrezzoFilter)
          }
        query.push(IdFilter)
      };

    return query;
}



const become_host_get = async (req,res) => {
    try{
        const id = JwtToken.decodedId(req); 
        var user = await Utente.diventaHost(id); //test
        //distruggo cookie + token attuale
        //res.cookie("jwt", "", { maxAge: 1 });
        //--------------------/
        //ricreo cookie + token 
        var token_host = JwtToken.createTokenHost(id);
        res.cookie("host", token_host, { httpOnly: true, expiresIn: maxAge * 1000});
        //--------------------/
        res.status(200).json({message: 'Utente trasformato in Host con successo!', user});
    } catch (err) {
        const errors = errorsHandler(err);
        res.status(400).json({ errors });
    }
}

const aggiungi_inserzione_post = async (req,res) => {
    try{
        const {nome,citta,checkin,checkout,nospiti,desc,prezzo} = req.body;
        const id_host = JwtToken.decodedId(req);
        var fields = await parseField(nome,citta,checkin,checkout,nospiti,desc,prezzo,id_host);
        //console.log(fields);
        var inserzione = await Inserzione.aggiungiInserzione(fields);
        res.status(200).json({message: 'Inserzione creata con successo!', new_insertion: inserzione});
    } catch (err) {
        const errors = errorsHandler(err);
        res.status(400).json({errors});
    }
}

const visualizza_inserzioni_get = async (req,res) => {
    try{
        const id_host = JwtToken.decodedId(req);
        var lista = await Inserzione.processaLista(id_host);
        res.status(200).json({lista});
    } catch (err) {
        const errors = errorsHandler(err);
        res.status(400).json({errors});
    }
}

const modifica_inserzione_put = async (req,res) => {
    try{
        const {id_inserzione,nome,citta,checkin,checkout,nospiti,desc} = req.body;
        var fields = await parseField(nome,citta,checkin,checkout,nospiti,desc,id_inserzione);
        var inserzione_m = await Inserzione.modificaInserzione(id_inserzione,fields);
        res.status(200).json({message: 'hai modificato questa inserzione con successo!', inserzione_m});
    } catch (err) {
        const errors = errorsHandler(err);
        res.status(400).json({errors});
    }
}

const cancella_inserzione_delete = async (req,res) => {
    try{
        const {id_inserzione} = req.body;
        var fields = await parseField(id_inserzione);
        var inserzione_d = await Inserzione.cancellaInserzione(fields);
        res.status(200).json({message: 'hai cancellato questa inserzione con successo!', inserzione_d});
    } catch (err) {
        const errors = errorsHandler(err);
        res.satus(400).json({errors});
    }
}


module.exports = {become_host_get,aggiungi_inserzione_post,visualizza_inserzioni_get,modifica_inserzione_put,cancella_inserzione_delete}; // 