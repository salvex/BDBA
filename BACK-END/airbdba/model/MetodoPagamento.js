const {Sequelize, DataTypes} = require("sequelize");
const db = require('../utils/connection');
//TO-DO ASSOCIAZIONI : LE ASSOCIAZIONI SONO TUTTE UNA A MOLTI



const MetodoPagamento = db.sequelize.define("metodo_pagamento", {
    ref_utente: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true
    },
    codice_carta: {
        type: DataTypes.INTEGER(20),
        allowNull: false,
    },
    nome_intestatario: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    data_scadenza: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    cvv: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = MetodoPagamento;