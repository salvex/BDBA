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
          console.log(host.email);
        } /* else if (
          moment().diff(moment(host.hostBecomeAt), "months") >= 3 &&
          numPrenotazioni > 0
        ) {
          console.log(host.email);
        }*/
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { checkRendiconto };
