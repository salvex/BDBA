const Inserzione = require("../model/Inserzione");

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
    res.status(200).json({ show });
  } catch (err) {
    const error = errorsHandler(err);
    res.status(404).json({ error });
  }
};

module.exports = { mostra_get };
