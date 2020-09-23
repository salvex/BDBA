const Inserzione = require("../model/Inserzione");
const Prenotazione = require("../model/Prenotazione");
const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);


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

    let date = []; //array contenente le date di check-in e check-out associate alle inserzioni

    let show = await Inserzione.mostra(req.query.id);

    let dates = await Prenotazione.findAll({ //risultato dell'interrogazione che viene passato nel foreach
      attributes: ["id_prenotazione","check_in", "check_out"],
      where: {
        ref_inserzione: req.query.id,
      },
    });
    
    dates.forEach(d => {
      let range = moment().range(d.check_in,d.check_out);
      let array = Array.from(range.by("days"));
      date = date.concat(array);
      console.log(date);
    })

    date = date.map(res => {
      return res.format("YYYY-MM-DD"); 
    });

    req.session.inserzione = show;
    //console.log(req.session.inserzione);
    res.status(200).json( {show,date} );
  } catch (err) {
    const error = errorsHandler(err);
    res.status(500).json({ error });
  }
};

module.exports = { mostra_get };
