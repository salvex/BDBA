const Sequelize = require("sequelize");


module.exports = sequelize.define("Utente", {
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
    }
})