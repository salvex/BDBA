const {Sequelize, DataTypes} = require("sequelize");
const db = require('../utils/connection');
const Utente = require('./Utente');


//TO-DO ASSOCIAZIONI : LE ASSOCIAZIONI SONO TUTTE UNA A MOLTI
const Inserzione = db.sequelize.define("inserzione", {
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
    prezzo_base: {
        type: DataTypes.INTEGER(30),
        allowNull: false
    },
    galleryPath: {
        type: DataTypes.STRING(300),
        allowNull: true
    }, 
    ref_host_ins: {
        //chiave esterna riferita a utente
        type: DataTypes.INTEGER(11),
        required: true,
        allowNull: false    
    }
}, {
    freezeTableName: true,
    timestamps: false
});

//ASSOCIAZIONE [1-MOLTI] 
Utente.hasMany(Inserzione, {
    foreignKey: 'ref_host_ins',
    onDelete: "cascade"
});
Inserzione.belongsTo(Utente, {
    foreignKey: 'ref_host_ins'
});

//--------------------------------------//


Inserzione.verRicerca = async (query) => {
    const lista = await Inserzione.findAll({where: query});
    if(lista) {
        return lista;
    }
    throw new Error("Nessuna inserzione");
}

Inserzione.aggiungiInserzione = async (query) => {
    if(query) {
        /*const oldIns = await Inserzione.findOne({
             where: {
                nome_inserzione: query[0]
            }
        })*/
        //se l'inserzione non esiste
        const newIns = await Inserzione.create({
            nome_inserzione: query[0],
            citta: query[1],
            check_in: query[2],
            check_out: query[3],
            n_ospiti: query[4],
            descrizione: query[5],
            ref_host_ins: query[6]
        });
        return newIns;
    } 
    throw new Error("query vuota");
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

Inserzione.processaLista = async (id_host) => {
    const lista = await Inserzione.findAll({
        attributes: ['id_inserzione', 'nome_inserzione', 'citta', 'check_in', 
        'check_out', 'n_ospiti', 'descrizione', 'galleryPath'],
        where: {
            ref_host_ins: id_host
        },
        include: {
            model: Utente,
            required: true,
            attributes: ['isHost']
        },       
    })
    if(lista) {
        return lista;
    }
    throw new Error("Nessuna inserzione");
}

Inserzione.modificaInserzione = async (id_ins) => {
    
}




module.exports = Inserzione;
