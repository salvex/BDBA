const db = require('../utils/connection.js');
const Inserzione = require('../model/Inserzione');
const { Op } = require("sequelize");

exports.verRicerca = (req,res,next) => {
    console.log("Ricerca in corso..");

    //const { nomeCittà,checkIn,checkOut,nOspiti } = req.body;

    //nomeCittà = nomeCittà.toLowerCase();

    Inserzione.findAll({ //TO-DO: appena colleghiamo al frontend, si fa la decostruzione
        where: {
            citta : { [Op.like]: '%' + req.body.citta + '%'} ,
            check_in : req.body.checkin,
            check_out: req.body.checkout,
            n_ospiti: req.body.nospiti 
        }
    }).then(inserzione => {
        if(inserzione.lenght === 0) {
            return res.status(404).send({message : 'Nessuna inserzione trovata'});
            //console.log(inserzione);
        } else {
            return res.status(200).send(inserzione);
            //console.log(inserzione);
        }
    }).catch(err => {
        res.status(500).send(err);
    })

    next();

}