const Prenotazione = require("../model/Prenotazione");
const moment = require("moment");
const Ospite = require("../model/Ospite");
const { Op } = require("sequelize");
const MetodoPagamento = require("../model/MetodoPagamento");

//COSE DA FARE: CONTROLLO SE HAI FATTO LOGIN //FATTO!
//              CONTROLLO 28 GIORNI //FATTO!
//              IDENTIFICAZIONE OSPITI
//              PAGAMENTO (VABE SIMULATO)

const effettua_pren_get = async (req, res) => {
  console.log("Prenotazione in corso..");
  try {
    const result = await Prenotazione.getCheckInCheckOut(
      req.session.utente.id,
      req.query.id
    );
    var giorniTotali = 0;
    var annoCorrente = moment().format("YYYY");
    var annoSuccessivo = moment().add(1, "y").format("YYYY");
    result.forEach((date) => {
      if (
        moment(date.check_in).format("YYYY") == annoCorrente - 1 &&
        moment(date.check_out).format("YYYY") == annoCorrente
      ) {
        giorniTotali += moment(date.check_out).diff(
          moment().startOf("year"),
          "days"
        );
      } else if (
        moment(date.check_in).format("YYYY") == annoCorrente &&
        moment(date.check_out).format("YYYY") == annoSuccessivo
      ) {
        giorniTotali += moment("2020-12-31").diff(
          moment(date.check_in),
          "days"
        );
      } else if (
        moment(date.check_in).format("YYYY") == annoCorrente &&
        moment(date.check_out).format("YYYY") == annoCorrente
      ) {
        giorniTotali += moment(date.check_out).diff(
          moment(date.check_in),
          "days"
        );
      }
    });
    console.log(giorniTotali);
    if (giorniTotali < 28) {
      /*riepilogo*/
      const prezzo = req.session.inserzione.prezzo;
      res.render("identify", {prezzo});
      console.log("procedi con la prenotazione");
    } else {
      console.log("impossibile procedere con la prenotazione");
      res.status(400).end();
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({err});
  }
};

const identifica_ospiti_post =  (req,res) => {
  try {
    const ospiti = req.body.ospiti;
    console.log(ospiti);
    req.session.ospiti = ospiti;
    res.status(200).json(req.session.ospiti); 
  } catch (err) {
    console.log(err);
    res.status(400).json({err});
  }
}

const pagamento_get = async (req,res) => {
  try{
    var metodo_p = await MetodoPagamento.getPagamento(req.session.utente.id);
    var riepilogo = req.session.inserzione;
    if(metodo_p){
      res.render("pagamento",{metodo_p,riepilogo});
    } else {
      res.render("pagamento");
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({err});
  }
}

const pagamento_post = async (req,res) => {
  try {
    if(req.body.option == 1){ //SE IL METODO E' GIA' PREIMPOSTATO
      //PREPARAZIONE PAGAMENTO
      
    }else if(req.body.option == 2) { //SE IL METODO E' NUOVO
      const {intestatario,numero_carta,cvv,scadenza_mese,scadenza_anno} = req.body.metodo_pagamento;
      let scadenza = scadenza_mese + "/" + scadenza_anno;
      const pagamento = await MetodoPagamento.SetOrUpdate(req.session.utente.id,intestatario,numero_carta,scadenza,cvv);
    } 
  } catch (err) {
    console.log(err);
    res.status(400).json({err});
  }
}


//PIPPO

module.exports = { effettua_pren_get,identifica_ospiti_post,pagamento_get };
