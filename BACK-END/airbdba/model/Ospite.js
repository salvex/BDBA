const {Sequelize, DataTypes} = require("sequelize");
const db = require('../utils/connection');
const Prenotazione = require('../model/Prenotazione');
//TO-DO ASSOCIAZIONI : LE ASSOCIAZIONI SONO TUTTE UNA A MOLTI



const Ospite = db.sequelize.define("ospite", {
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
    },
    isEsente: {
        type: DataTypes.INTEGER(1),
        defaultValue: 0,
    }
}, {
    freezeTableName: true,
    timestamps: false
});

//----ASSOCIAZIONE [1-N] PRENOTAZIONE-OSPITE //
Prenotazione.hasMany(Ospite, {
    foreignKey: 'ref_prenotazione_u'
})
Ospite.belongsTo(Prenotazione, {
    foreignKey: 'ref_prenotazione_u'
})

module.exports = Ospite;