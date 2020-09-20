const Inserzione = require("../model/Inserzione");
const Prenotazione = require("../model/Prenotazione");

const errorsHandler = (err) => {
  let error = { message: "" };
  if (err.message === "Inserzione inesistente") {
    error.message = "L'inserzione non esiste";
  }
  return error;
};

const mostra_get = async (req, res) => {
  try {
    // inserzione sarebbe show 
    const show = await Inserzione.mostra(req.query.id);

    const date = await Prenotazione.findAll({
      attributes: ["id_prenotazione","check_in", "check_out"],
      where: {
        ref_inserzione: req.query.id,
      },
    });

    show.prenotazioni = date;

    const result = show.prenotazioni;

    req.session.inserzione = inserzione;
    //console.log(req.session.inserzione);
    console.log(result);
    res.status(200).json({ result });
  } catch (err) {
    const error = errorsHandler(err);
    res.status(404).json({ error });
  }
};

module.exports = { mostra_get };
