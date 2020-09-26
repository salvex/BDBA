const { Sequelize, DataTypes, Op } = require("sequelize");
const db = require("../utils/connection");
const Inserzione = require("./Inserzione");


const Servizi = db.sequelize.define(
    "servizi",
    {
        ref_inserzione_s : {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true 
        },
        wifiFlag : {
            type: DataTypes.INTEGER(11),
        },
        riscaldamentoFlag : {
            type: DataTypes.INTEGER(11),
        },
        frigoriferoFlag : {
            type: DataTypes.INTEGER(11),
        },
        casaFlag : {
            type: DataTypes.INTEGER(11),
        },
        bnbFlag : {
            type: DataTypes.INTEGER(11),
        },
        parcheggioFlag : {
            type: DataTypes.INTEGER(11),
        },
        ascensoreFlag : {
            type: DataTypes.INTEGER(11),
        },
        cucinaFlag : {
            type: DataTypes.INTEGER(11),
        },
        essenzialiFlag : {
            type: DataTypes.INTEGER(11),
        },
        pisicinaFlag : {
            type: DataTypes.INTEGER(11),
        },
    },
    {
        freezeTableName: true,
    }   
)

module.exports = Servizi;