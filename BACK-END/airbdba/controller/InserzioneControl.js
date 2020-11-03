const Inserzione = require("../model/Inserzione");
const Prenotazione = require("../model/Prenotazione");
const Moment = require("moment");
const MomentRange = require("moment-range");

const moment = MomentRange.extendMoment(Moment);

const errorsHandler = (err) => {
  let error = { message: "" };
  if (err.message === "Inserzione inesistente") {
    error.message = "L'inserzione non esiste";
  }
  return error;
};

const mostra_get = async (req, res, next) => {
  try {
    // inserzione sarebbe show

    let date = []; //array contenente le date di check-in e check-out associate alle inserzioni

    let show = await Inserzione.mostra(req.params.id);

    let dates = await Prenotazione.getPrenotazioni(req.params.id);

    dates.forEach((d) => {
      let range = moment().range(d.check_in, d.check_out);
      let array = Array.from(range.by("days"));
      date = date.concat(array);

    });

    date = date.map((res) => {
      return res.format("YYYY-MM-DD");
    });

    date.sort((a, b) => {
      return new Date(a) - new Date(b);
    });

    req.session.inserzione = show;
    res.locals.inserzione = JSON.stringify(show);
    res.locals.date = JSON.stringify(date);
    next();
  } catch (err) {
    const error = errorsHandler(err);
    res.status(500).json({ error });
  }
};

module.exports = { mostra_get };
