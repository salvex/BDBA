const db = require('../utils/connection.js');
const Utente = require('../model/Utente');
const Inserzione = require('../model/Inserzione');
require("dotenv").config();
const JwtToken = require('../utils/JwtToken');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

const maxAge = 60 * 60 * 24;


var errorsHandler = (err) => {
    let errors = {  email: "", query: "", ins: ""};
  
    if (err.message === "Utente non aggiornato" ) {
      errors.email = 
        "L'Utente non è riuscito a diventare host";
    } else if (err.message === "query vuota") {
        errors.query = 
        "L'inserimento non è andato a buon termine"
    } else if (err.message === "Nessuna inserzione") {
        errors.ins =
        "Nessuna inserzione creata"
    }
  
  
    return errors;
};

async function parseField(NomeFilter ,CittàFilter,CheckInFilter,CheckOutFilter,nOspitiFilter,DescFilter,PrezzoFilter, PathFilter,IdFilter) {
    
    const query = [];

    if (NomeFilter  || CittàFilter || CheckInFilter || CheckOutFilter || nOspitiFilter || PrezzoFilter || DescFilter || PathFilter  ) {
        if (NomeFilter  ) {
            query[0] = NomeFilter
        } 
        if (CittàFilter ) {
            query[1] = CittàFilter;
        } 
        if (CheckInFilter ) {
            query[2] = CheckInFilter;
        } 
        if (CheckOutFilter ) {
            query[3] = CheckOutFilter;
        } 
        if (nOspitiFilter ) {
            query[4] = nOspitiFilter;
        } 
        if (DescFilter ) {
            query[5] = DescFilter;
        }
        if (PrezzoFilter ) {
            query[6] = PrezzoFilter;
        }
        if (PathFilter ) {
            query[7] = PathFilter;
        }
        if (IdFilter ) {
            query[8] = IdFilter;
        }
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
        var path = req.files['gallery'][0].path;
        var fields = await parseField(nome,citta,checkin,checkout,nospiti,desc,prezzo,path,id_host);
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
        const errors = errorsHandler(err); //
        res.status(400).json({errors}); 
    }
}

const modifica_inserzione_put = async (req,res) => {
    try{
        const {id_inserzione,nome,citta,checkin,checkout,nospiti,desc,prezzo} = req.body;
        var path = req.files['gallery'][0].path;
        const id_host = JwtToken.decodedId(req);
        var fields = await parseField(nome,citta,checkin,checkout,nospiti,desc,prezzo,path,id_host);
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
        var deleteFlag = await Inserzione.cancellaInserzione(id_inserzione);
        res.status(200).json({message: 'hai cancellato questa inserzione con successo!', deleteFlag});
    } catch (err) {
        const errors = errorsHandler(err);
        res.status(400).json({errors});
    }
}


module.exports = {become_host_get,aggiungi_inserzione_post,visualizza_inserzioni_get,modifica_inserzione_put,cancella_inserzione_delete}; // 