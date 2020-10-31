const Prenotazione = require("../model/Prenotazione");
var moment = require("moment");

const checkPrenotazioneData = async () => {
  try {
    var listaPren = await Prenotazione.findAll();
    if (listaPren) {
      listaPren.forEach(async (prenotazione) => {
        if (
          prenotazione.check_in < moment() &&
          prenotazione.stato_prenotazione == 1
        ) {
          await prenotazione.destroy();
        }
      });
      await listaPren.save();
    } else {
      console.log("nessuna prenotazione nel sistema");
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { checkPrenotazioneData };
