const {Sequelize, DataTypes} = require("sequelize");
const db = require('../utils/connection');
//TO-DO ASSOCIAZIONI : LE ASSOCIAZIONI SONO TUTTE UNA A MOLTI



const Ospite = db.sequelize.define("Ospite", {
    nome: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    cognome: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    ref_prenotazione_u: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true
    }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = Ospite;