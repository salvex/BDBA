const Utente = require("../model/Utente");
const Prenotazione = require("../model/Prenotazione");
const { Op } = require("sequelize");
var moment = require("moment");

const checkRendiconto = async () => {
  try {
    const listaHost = await Utente.findAll({ where: { isHost: 1 } });
    if (listaHost) {
      listaHost.forEach(async (host) => {
        const numPrenotazioni = await Prenotazione.count({
          where: {
            ref_host: host.id,
            stato_prenotazione: 3,
            check_in: {
              [Op.gt]: host.ultimo_rendiconto,
            },
          },
        });

        if (
          moment().diff(moment(host.ultimo_rendiconto), "months") >= 3 &&
          numPrenotazioni > 0
        ) {
          let bodyMail = {
            from: '"Sistema AIRBDBA" <bdba.services@gmail.com>',
            bcc: host.email,
            subject: "Promemoria rendiconto uccifio del turismo",
            text:
              "Ti ricordiamo che hai l'obbligo di rendicontare l'ammontare delle tasse di soggiorno all'ufficio del turismo. Sono passati più di tre mesi dall'ultimo rendiconto. Dirigiti nella sezione 'Contatta Ufficio del turismo' e mettiti in regola il prima possibile.\n\n Cordiali saluti, Team AIRBDBA",
          };

          await transporter.sendMail(bodyMail, (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log("Messaggio inviato: %s", info.messageId);
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { checkRendiconto };
