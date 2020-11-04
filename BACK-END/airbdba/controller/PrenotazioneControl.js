const Prenotazione = require("../model/Prenotazione");
const moment = require("moment");
const Ospite = require("../model/Ospite");
const { Op } = require("sequelize");
const MetodoPagamento = require("../model/MetodoPagamento");
var transporter = require("../utils/mailSender");
const Utente = require("../model/Utente");

const effettua_pren_get = async (req, res) => {
  console.log("Prenotazione in corso..");
  try {
    const giorni_da_pren = req.params.giorni_da_pren;
    const result = await Prenotazione.getCheckInCheckOut(
      req.params.id,
      req.session.utente.id
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

    giorniTotali += Number.parseInt(giorni_da_pren);

    if (giorniTotali < 28) {
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
    req.session.ospiti = ospiti;
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

const pagamento_get = async (req, res, next) => {
  try {
    var lista_metodi = await MetodoPagamento.get_metodi(req.session.utente.id);

    res.locals.lista_metodi = JSON.stringify(lista_metodi);
    req.session.prezzo = req.query.prezzo;
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
      var metodo_pagamento = await MetodoPagamento.create({
        ref_utente: req.session.utente.id,
        intestatario: intestatario,
        codice_carta: codice_carta,
        nome_circuito: nome_circuito,
        data_scadenza: scadenza,
        cvv: cvv,
      });
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
      n_ospiti_pren: req.query.nospiti,
      prezzo_finale: req.session.prezzo,
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
  next();
};

const riepilogo_post = async (req, res) => {
  try {
    // Verifico che la prentazione esista
    const checkPren = await Prenotazione.findAll({
      where: {
        check_in: req.session.prenotazione.check_in,
        ref_inserzione: req.session.prenotazione.ref_inserzione,
      },
    });
    // Se già esiste una prenotazione di questo tipo allora vuol dire
    // che l'utente l'ha già eseguita
    if (checkPren.length === 0) {
      const prenotazione = await Prenotazione.create(req.session.prenotazione);
      const host = await Utente.findByPk(req.session.inserzione.ref_host_ins);

      let bodyMail1 = {
        from: '"Sistema AIRBDBA" <bdba.services@gmail.com>',
        bcc: host.email,
        subject: "Nuova richiesta di prenotazione",
        text: `Buone notizie!\n Un utente ha effettuato una richiesta di prenotazione. Visita la sezione 'Gestione Host' per gestire la richiesta.  \n\n Cordiali Saluti, Team AIRBDBA `,
      };
      let bodyMail2 = {
        from: '"Sistema AIRBDBA" <bdba.services@gmail.com>',
        bcc: req.session.utente.email,
        subject: "Richiesta di prenotazione effettuata",
        text: `La tua richiesta di prenotazione è stata inoltrata con successo all'host della struttura ${req.session.inserzione.nome_inserzione}. Riceverei un email di notifica con l'esito della tua richiesta. \n\n Cordiali Saluti, Team AIRBDBA`,
      };
      await transporter.sendMail(bodyMail1, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Messaggio inviato: %s", info.messageId);
      });
      await transporter.sendMail(bodyMail2, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Messaggio inviato: %s", info.messageId);
      });

      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

module.exports = {
  effettua_pren_get,
  identifica_ospiti_post,
  pagamento_get,
  pagamento_post,
  riepilogo_get,
  riepilogo_post,
};
