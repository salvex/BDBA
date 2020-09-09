const {Sequelize, DataTypes} = require("sequelize");
const db = require('../utils/connection');
//TO-DO ASSOCIAZIONI : LE ASSOCIAZIONI SONO TUTTE UNA A MOLTI



const Prenotazione = db.sequelize.define("prenotazione", {
    id_prenotazione: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    ref_host: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
    },
    ref_utente: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
    },
    stato_ordine: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
    },
    ref_inserzione: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = Prenotazione;

Prenotazione.checkPermanenza = async () => {
    
}