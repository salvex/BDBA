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
    const show = await Inserzione.mostra(req.query.id);
    const date = await Prenotazione.findAll({
      attributes: ["check_in", "check_out"],
      where: {
        ref_inserzione: req.query.id,
      },
    });
  
    res.status(200).json({ show, date });
  } catch (err) {
    const error = errorsHandler(err);
    res.status(404).json({ error });
  }
};

module.exports = { mostra_get };
