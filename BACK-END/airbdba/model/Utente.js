const Sequelize = require("sequelize");
const db = require('../utils/connection');

module.exports = db.sequelize.define("Utente", {
    id: {
        type: Sequelize.INTEGER(50),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING(50),
        allowNull: false
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
    indirizzo: {
        type: Sequelize.STRING(80),
        allowNull: false
    },
    data_nascita: {
        type: Sequelize.DATE(20),
        allowNull: false
    }, 
    numero_telefonico: {
        type: Sequelize.INTEGER(11),
        allowNull: false 
    }
})