const Sequelize = require("sequelize");
const db = require('../utils/connection');
//TO-DO mettere un validate, modificare allowNull per tutti gli attributi tranne id

const Inserzione = db.sequelize.define("Inserzione", {
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

Inserzione.verRicerca = async (query) => {
    const lista = await Inserzione.findAll({where: query});
    if(lista) {
        return lista;
    }
    throw new Error("Nessuna inserzione");
}

Inserzione.mostra = async (idInserzione) => {
    const risultato = await Inserzione.findOne({
        where: {
            id_inserzione: idInserzione
        }
    });
    if(risultato) {
        return risultato;
    }
    throw new Error("Inserzione inesistente");
}


module.exports = Inserzione;
