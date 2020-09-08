const {Sequelize, DataTypes} = require("sequelize");
const db = require('../utils/connection');
//TO-DO mettere un validate, modificare allowNull per tutti gli attributi tranne id
//TO-DO ASSOCIAZIONI : LE ASSOCIAZIONI SONO TUTTE UNA A MOLTI
const Inserzione = db.sequelize.define("Inserzione", {
    id_inserzione: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    nome_inserzione: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    citta: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    check_in: {
        type: DataTypes.DATE,
        allowNull: false
    }, 
    check_out: {
        type: DataTypes.DATE,
        allowNull: false
    },
    n_ospiti: {
        type: DataTypes.INTEGER(11),
        validate: {
            len: {
                args: [1,2],
                msg: "Numero ospiti elevato",
            },
        },
    },
    descrizione: {
        type: DataTypes.STRING(300),
        allowNull: false
    }, 
    ref_host_ins: {
        type: DataTypes.INTEGER(11),
        allowNull: false    
    }
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

//Funzione temporanea
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
