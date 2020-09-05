const db = require('../utils/connection.js');
const Inserzione = require('../model/Inserzione');


exports.mostra = (req,res) => {
    Inserzione.findOne({
        where: {
            id_inserzione: req.body.id_inserzione
        }
    }).then(inserzione => {
        if(!inserzione) {
            return res.status(404).send({message : 'Inserzione inesistente'});
        } else {
            return res.status(200).send(inserzione);
        }
    }).catch(err=> {
        return res.status(500).send(error);
    })
}