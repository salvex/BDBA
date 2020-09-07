const {Sequelize,DataTypes} = require("sequelize");
const db = require('../utils/connection');
//TO-DO mettere un validate, modificare allowNull per tutti gli attributi tranne id
//TO-DO ASSOCIAZIONI : LE ASSOCIAZIONI SONO TUTTE UNA A MOLTI

const Utente = db.sequelize.define("Utente", {
    id: {
        type: DataTypes.INTEGER(50),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isEmail: true
        }
    }, 
    password: {
        type: DataTypes.STRING(256),
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    cognome: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
/*    indirizzo: {
        type: DataTypes.STRING(80),
        allowNull: false
    },
    data_nascita: {
        type: DataTypes.DATEONLY,
        validate: {
            notEmpty: {
              msg: "Inserisci una data",
            },
          },
    }, 
    numero_telefonico: {
        type: DataTypes.INTEGER,
        
    },*/
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = Utente;