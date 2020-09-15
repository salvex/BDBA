const db = require("../utils/connection.js");
const Prenotazione = require("../model/Prenotazione");
const Ospite = require("../model/Ospite");
const Inserzione = require("../model/Inserzione");
const moment = require("moment");
const { Op } = require("sequelize");

//COSE DA FARE: CONTROLLO SE HAI FATTO LOGIN //FATTO!
//              CONTROLLO 28 GIORNI //FATTO!
//              IDENTIFICAZIONE OSPITI
//              PAGAMENTO (VABE SIMULATO)

const effettua_pren_get = async (req, res) => {
  console.log("Prenotazione in corso..");
  try {
    const result = await Prenotazione.getCheckInCheckOut(
      req.session.utente.id,
      req.params.id
    );
    var giorniTotali = 0;
    var annoCorrente = moment().format("YYYY");
    result.forEach((date) => {
      if (
        moment(date.check_in).format("YYYY") == annoCorrente - 1 &&
        moment(date.check_out).format("YYYY") == annoCorrente
      ) {
        giorniTotali += moment(date.check_out).diff(
          moment().startOf("year"),
          "days"
        );
      } else {
        giorniTotali += moment(date.check_out).diff(
          moment(date.check_in),
          "days"
        );
      }
    });
    console.log(giorniTotali);
    if (giorniTotali < 28) {
      console.log("procedi con la prenotazione");
      res.status(200).end();
    } else {
      console.log("impossibile procedere con la prenotazione");
      res.status(400).end();
    }
  } catch (err) {
    console.log(err);
    res.status(400).end();
  }
};
//var prova = req.body.prova;

//console.log(prova);

module.exports = { effettua_pren_get };

/*      var giorniTotali = 0;
      result.forEach((date) => {
        giorniTotali += moment(date.check_out).diff(
          moment(date.check_in),
          "days"
        );
      });
      console.log(giorniTotali);

      if (giorniTotali < 28) {
        console.log("procedi con la prenotazione");
      } else {
        console.log("impossibile procedere con la prenotazione");
      }
      res.status(200).end();
    }
*/
