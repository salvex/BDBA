const Utente = require("../model/Utente");
var moment = require("moment");

const checkRendiconto = async () => {
  try {
    const listaHost = await Utente.findAll({ where: { isHost: 1 } });
    if (listaHost) {
      listaHost.forEach((host) => {
        if (moment().diff(moment(host.ultimo_rendiconto), "months") >= 3) {
          console.log(host.utente.email);
        }
      });
    } else {
      console.log("LISTA VUOTA");
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { checkRendiconto };
