
const Prenotazione = require('../model/Prenotazione');
var moment = require('moment');

const checkPrenotazioneData = async () => {
    try {
        var listaPren = await Prenotazione.findAll();
        if(listaPren) {
            listaPren.forEach(elem => {
                if(elem.check_in < moment() && elem.stato_prenotazione == 1) {
                    elem.stato_prenotazione = 0;
                }
            })
            await listaPren.save();
        } else {
            console.log("nessuna prenotazione nel sistema");
        }
    } catch (err) {
        console.log(err);
    } 
}

module.exports = {checkPrenotazioneData};