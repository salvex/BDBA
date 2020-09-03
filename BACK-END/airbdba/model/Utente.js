const Sequelize = require("sequelize");
const db = require('../utils/connection');
//TO-DO mettere un validate, modificare allowNull per tutti gli attributi tranne id

module.exports = db.sequelize.define("Utente", {
    id: {
        type: Sequelize.INTEGER(50),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
            isEmail: true
        }
    }, 
    password: {
        type: Sequelize.STRING(256),
        allowNull: false
    },
    nome: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    cognome: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
/*    indirizzo: {
        type: Sequelize.STRING(80),
        allowNull: false
    },
    data_nascita: {
        type: Sequelize.DATEONLY,
        validate: {
            notEmpty: {
              msg: "Inserisci una data",
            },
          },
    }, 
    numero_telefonico: {
        type: Sequelize.INTEGER,
        
    },*/
}, {
    freezeTableName: true,
    timestamps: false
});