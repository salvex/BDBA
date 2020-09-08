const db = require('../utils/connection.js');
const Inserzione = require('../model/Inserzione');
const { Op } = require("sequelize");

const errorsHandler = (err) => {
    let error = { message: "" };
    if (err.message === "Nessuna inserzione" || err.message === "") {
      error.message = "Non è stata trovata nessuna inserzione";
    }
    return error;
  };



const ricerca_get = async (req,res,next) => {
    try {
        var nomeCittà = req.body.citta;       
        nomeCittà = nomeCittà.toLowerCase();
        console.log("Ricerca in corso..");
        const format_fields = await parseField(nomeCittà,req.body.checkin,req.body.checkout,req.body.nospiti);
        console.log(format_fields);
        const search_list = await Inserzione.verRicerca(format_fields);
        res.status(200).json({search_list});
    } catch (err) { 
        const error = errorsHandler(err);
        res.status(404).json({error});
    }
    
}

async function parseField(CittàFilter,CheckInFilter,CheckOutFilter,nOspitiFilter) {
    
    const query = {};

    if (CittàFilter || CheckInFilter || CheckOutFilter || nOspitiFilter) {
        query[Op.or] = []
        if (CittàFilter) {
          query[Op.or].push({
            citta: {
              [Op.like]: `%${CittàFilter}%` //`%${CittàFilter}%`
            }
          })
        }
        if (CheckInFilter) {
          query[Op.or].push({
            check_in: {
              [Op.like]: `%${CheckInFilter}%`,
              [Op.gte]: `%${CheckInFilter}%`
            }
          })
        }
        if (CheckOutFilter) {
          query[Op.or].push({
            check_out: {
              [Op.like]: `%${CheckOutFilter}%`,
              [Op.lte]: `%${CheckOutFilter}%`
            }
          })
        }
        if (nOspitiFilter) {
            query[Op.or].push({
              n_ospiti: {
                [Op.like]: `%${nOspitiFilter}%`
              }
            })
          }
      };

    return query;
}


module.exports = {ricerca_get};