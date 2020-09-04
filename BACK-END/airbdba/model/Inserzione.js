const Sequelize = require("sequelize");
const db = require('../utils/connection');
//TO-DO mettere un validate, modificare allowNull per tutti gli attributi tranne id

module.exports = db.sequelize.define("Inserzione", {
    id_inserzione: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    nome_inserzione: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    citta: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    check_in: {
        type: Sequelize.STRING(30),
        allowNull: false
    }, 
    check_out: {
        type: Sequelize.STRING(30),
        allowNull: false
    },
    n_ospiti: {
        type: Sequelize.INTEGER(11),
        validate: {
            len: {
                args: [1,2],
                msg: "Numero ospiti elevato",
            },
        },
    },
/*   
    ref_host: {
        type: //TO-DO,
        
    },*/
}, {
    freezeTableName: true,
    timestamps: false
});