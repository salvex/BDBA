const Prenotazione = require("../model/Prenotazione");
const moment = require("moment");
const Ospite = require("../model/Ospite");
const { Op } = require("sequelize");
const MetodoPagamento = require("../model/MetodoPagamento");
var transporter = require("../utils/mailSender");
const Utente = require("../model/Utente");

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
      console.log("procedi con la prenotazione");
      res.status(200).json({ success: true });
    } else {
      console.log("impossibile procedere con la prenotazione");
      res.status(400).json({ success: false });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

const identifica_ospiti_post = (req, res) => {
  try {
    const ospiti = req.body.ospiti;
    console.log(ospiti);
    req.session.ospiti = ospiti;
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

/* const pagamento_get = async (req, res) => {
  try {
    var lista_metodi = await MetodoPagamento.get_metodi(req.session.utente.id);
    res.status(200).json({ lista_metodi });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
}; */

/*const pagamento_post = async (req, res) => {
  //PER DANIEL: devi inviarmi gli oggetti metodo_pagamento,option e prezzo
  try {
    if (req.body.option == 1) {
      //SE IL METODO E' GIA' PREIMPOSTATO
      var prenotazione = await Prenotazione.create({
        ref_host: req.session.inserzione.ref_host_ins,
        ref_utente: req.session.utente.id,
        stato_ordine: 0, //STATO ORDINE: CREATO (PAGA ONLINE)
        check_in: req.query.checkin,
        check_out: req.query.checkout,
        prezzo_finale: req.body.prezzo,
      });
    } else if (req.body.option == 2) {
      //SE IL METODO E' NUOVO
      const {
        intestatario,
        numero_carta,
        cvv,
        scadenza_mese,
        scadenza_anno,
      } = req.body.metodo_pagamento;
      let scadenza = scadenza_mese + "/" + scadenza_anno;
      const pagamento = await MetodoPagamento.SetOrUpdate(
        req.session.utente.id,
        intestatario,
        numero_carta,
        scadenza,
        cvv
      );

      // PROCESSO DI PAGAMENTO : NON E' STATO IMPLEMENTATO IN QUANTO NON RICHIESTO //

      // crea la prenotazione
      var prenotazione = await Prenotazione.create({
        ref_host: req.session.inserzione.ref_host_ins,
        ref_utente: req.session.utente.id,
        ref_inserzione: req.session.inserzione.id_inserzione,
        stato_ordine: 0, //STATO ORDINE: CREATO (PAGA ONLINE)
        check_in: req.query.checkin,
        check_out: req.query.checkout,
        prezzo_finale: req.body.prezzo,
      });
    } else if (req.body.option == 3) {
      //PAGA IN LOCO
      // crea la prenotazione
      var prenotazione = await Prenotazione.create({
        ref_host: req.session.inserzione.ref_host_ins,
        ref_utente: req.session.utente.id,
        stato_ordine: 1, //STATO ORDINE: CREATO (PAGA IN LOCO)
        check_in: req.query.checkin,
        check_out: req.query.checkout,
        prezzo_finale: req.body.prezzo,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};*/

/*const riepilogo_get = async (req, res) => {
  try {
    const riepilogo = req.session.inserzione;
    // manda la mail
    /*let host = await Utente.findByPk(req.session.inserzione.ref_host_ins);
      let MailHost = host.email;
      let bodyMail = {
        from: '"Sistema AIRBDBA" <bdba_services@gmail.com> ',
        to: req.session.utente.email, MailHost,
        subject: "Prenotazione ID " + prenotazione.id_prenotazione + "Creata", 
        text: "Comunicazione", 
        html: "<b>RIEPILOGO PLACEHOLDER</b>", 
      };

      await transporter.sendMail(bodyMail, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Messaggio inviato: %s", info.messageId);
      });
    res.render("riepilogo", { riepilogo });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};*/
const pagamento_get = async (req, res, next) => {
  try {
    //DA RIVEDERE
    console.log(req.session.utente.id);
    var lista_metodi = await MetodoPagamento.get_metodi(req.session.utente.id);

    res.locals.lista_metodi = JSON.stringify(lista_metodi);
    console.log(res.locals.lista_metodi);
    next();
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

const pagamento_post = async (req, res, next) => {
  //PER DANIEL: devi inviarmi gli oggetti metodo_pagamento,option e prezzo
  try {
    if (req.body.option == 1) {
      //SE IL METODO E' GIA' PREIMPOSTATO
      var metodo_pagamento = req.body.metodo;
    } else if (req.body.option == 2) {
      //SE IL METODO E' NUOVO
      const {
        intestatario,
        codice_carta,
        nome_circuito,
        cvv,
        scadenza_mese,
        scadenza_anno,
      } = req.body.metodo;
      let scadenza = scadenza_mese + "/" + scadenza_anno;
      var metodo_pagamento = {
        ref_utente: req.session.utente.id,
        intestatario: intestatario,
        codice_carta: codice_carta,
        nome_circuito: nome_circuito,
        data_scadenza: scadenza,
        cvv: cvv,
      };
    } else if (req.body.option == 3) {
      //PAGA IN LOCO
      var metodo_pagamento = null;
    }
    var prenotazione = {
      ref_host: req.session.inserzione.ref_host_ins,
      ref_utente: req.session.utente.id,
      ref_inserzione: req.session.inserzione.id_inserzione,
      stato_prenotazione: 1,
      check_in: req.query.checkin,
      check_out: req.query.checkout,
      prezzo_finale: req.body.prezzo,
    };
    req.session.metodo_pagamento = metodo_pagamento;
    req.session.prenotazione = prenotazione;
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

const riepilogo_get = (req, res, next) => {
  res.locals.inserzione = req.session.inserzione;
  res.locals.prenotazione = req.session.prenotazione;
  res.locals.metodo_pagamento = req.session.metodo_pagamento;
  console.log(req.session.metodo_pagamento);
  next();
};

module.exports = {
  effettua_pren_get,
  identifica_ospiti_post,
  pagamento_get,
  pagamento_post,
  riepilogo_get,
};
