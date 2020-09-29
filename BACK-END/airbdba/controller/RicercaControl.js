const Inserzione = require("../model/Inserzione");
const { Op } = require("sequelize");

const errorsHandler = (err) => {
  let error = { message: "" };
  if (err.message === "Nessuna inserzione" || err.message === "") {
    error.message = "Non è stata trovata nessuna inserzione";
  }
  return error;
};

const ricerca_post = async (req, res, next) => {
  try {
    res.status(200).redirect("/search/res");
  } catch (err) {
    const error = errorsHandler(err);
    res.status(404).json({ error });
  }
};

const ricerca_get = async (req, res, next) => {
  try {
    const nomeCittà = req.query.citta.toLowerCase();
    console.log("Ricerca in corso..");
  /*  let checkin = Date.parse(req.query.checkin);
    let checout = Date.parse(req.query.checkout); */
    const format_fields = await parseField(
      nomeCittà,
      req.query.checkin,
      req.query.checkout,
      req.query.nospiti,
    /*  req.query.wifi,
      req.query.riscaldamento,
      req.query.frigorifero,
      req.query.casa,
      req.query.bnb,
      req.query.parcheggio,
      req.query.ascensore,
      req.query.cucina,
      req.query.essenziali,
      req.query.piscina*/
    );
    const search_list = await Inserzione.verRicerca(format_fields,req.query.checkin,req.query.checkout);
    //console.log(search_list);
    //res.status(200).render("search", {search_list});
    res.status(200).json({ search_list });
  } catch (err) {
    const error = errorsHandler(err);
    res.status(404).json({ error });
  }
};

async function parseField(
  CittàFilter,
  CheckInFilter,
  CheckOutFilter,
  nOspitiFilter
) {
  const query = {};

  if (CittàFilter || CheckInFilter || CheckOutFilter || nOspitiFilter) {
    query[Op.and] = [];
    if (CittàFilter) {
      query[Op.and].push({
        citta: {
          [Op.like]: `%${CittàFilter}%`, //`%${CittàFilter}%`
        },
      });
    }
    if (CheckInFilter && !CheckOutFilter) {
      query[Op.and].push({
        inizioDisponibilita: {
          [Op.lte]: `%${CheckInFilter}%`,
        },
        fineDisponibilita: {
          [Op.gte]: `%${CheckInFilter}%`,
        },
      });
    }
    if (CheckOutFilter && !CheckInFilter) {
      query[Op.and].push({
        inizioDisponibilita: {
          [Op.lte]: `%${CheckOutFilter}%`,
        },
        fineDisponibilita: {
          [Op.gte]: `%${CheckOutFilter}%`,
        },
      });
    }
    if (CheckInFilter && CheckOutFilter) {
      query[Op.and].push({
        inizioDisponibilita: {
          [Op.lte]: `%${CheckInFilter}%`,
        },
        fineDisponibilita: {
          [Op.gte]: `%${CheckOutFilter}%`,
        },
      });
    }
    if (nOspitiFilter) {
      query[Op.and].push({
        n_ospiti: {
          [Op.gte]: `${nOspitiFilter}`,
        },
      });
    }
  }

  return query;
}

module.exports = { ricerca_post, ricerca_get };
