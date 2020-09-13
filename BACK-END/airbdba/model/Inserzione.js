const { Sequelize, DataTypes } = require("sequelize");
const db = require("../utils/connection");
const Utente = require("./Utente");

//TO-DO ASSOCIAZIONI : LE ASSOCIAZIONI SONO TUTTE UNA A MOLTI
const Inserzione = db.sequelize.define(
  "inserzione",
  {
    id_inserzione: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    nome_inserzione: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    citta: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    inizioDisponibilita: {
      type: DataTypes.DATE(),
      allowNull: false,
    },
    fineDisponibilita: {
      type: DataTypes.DATE(),
      allowNull: false,
    },
    n_ospiti: {
      type: DataTypes.INTEGER(11),
      validate: {
        len: {
          args: [1, 2],
          msg: "Numero ospiti elevato",
        },
      },
    },
    descrizione: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    prezzo_base: {
      type: DataTypes.INTEGER(30),
      allowNull: false,
    },
    galleryPath: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    ref_host_ins: {
      //chiave esterna riferita a utente
      type: DataTypes.INTEGER(11),
      required: true,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

//ASSOCIAZIONE [1-MOLTI]-------
Utente.hasMany(Inserzione, {
  foreignKey: "ref_host_ins",
  onDelete: "cascade",
});
Inserzione.belongsTo(Utente, {
  foreignKey: "ref_host_ins",
});

//--------------------------------//

Inserzione.verRicerca = async (query) => {
  const lista = await Inserzione.findAll({ where: query });
  if (lista) {
    return lista;
  }
  throw new Error("Nessuna inserzione");
};

Inserzione.aggiungiInserzione = async (query) => {
  if (query) {
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
      prezzo_base: query[6],
      galleryPath: query[7],
      ref_host_ins: query[8],
    });
    return newIns;
  }
  throw new Error("query vuota");
};

//Funzione temporanea
Inserzione.mostra = async (idInserzione) => {
  const risultato = await Inserzione.findOne({
    where: {
      id_inserzione: idInserzione,
    },
  });
  if (risultato) {
    return risultato;
  }
  throw new Error("Inserzione inesistente");
};

Inserzione.processaLista = async (id_host) => {
  const lista = await Inserzione.findAll({
    attributes: [
      "id_inserzione",
      "nome_inserzione",
      "citta",
      "check_in",
      "check_out",
      "n_ospiti",
      "descrizione",
      "prezzo_base",
      "galleryPath",
    ],
    where: {
      ref_host_ins: id_host,
    },
    include: {
      model: Utente,
      required: true,
      attributes: ["isHost"],
    },
  });
  if (lista) {
    return lista;
  }
  throw new Error("Nessuna inserzione");
};

Inserzione.modificaInserzione = async (id_ins, query) => {
  const ins_modifica = await Inserzione.findByPk(id_ins);
  if (!ins_modifica) {
    throw new Error("Nessuna inserzione");
  }
  console.log("modifica in corso");

  if (query) {
    if (query[0]) {
      //nome inserzione
      ins_modifica.nome_inserzione = query[0];
    }
    if (query[1]) {
      ins_modifica.citta = query[1];
    }
    if (query[2]) {
      ins_modifica.check_in = query[2];
    }
    if (query[3]) {
      ins_modifica.check_out = query[3];
    }
    if (query[4]) {
      ins_modifica.n_ospiti = query[4];
    }
    if (query[5]) {
      ins_modifica.descrizione = query[5];
    }
    if (query[6]) {
      ins_modifica.prezzo_base = query[6];
    }
    await ins_modifica.save();
    return ins_modifica;
  } else {
    throw new Error("query vuota");
  }
};

Inserzione.modificaInserzione_img = async (id_ins, query) => {
  const ins_modifica = await Inserzione.findByPk(id_ins);
  if (!ins_modifica) {
    throw new Error("Nessuna inserzione");
  }
  console.log("modifica in corso");

  if (query) {
    ins_modifica.galleryPath = query;
    await ins_modifica.save();
    return ins_modifica;
  } else {
    throw new Error("query vuota");
  }
};

Inserzione.cancellaInserzione = async (id_ins) => {
  const ins_cancella = await Inserzione.destroy({
    where: {
      id_inserzione: id_ins,
    },
  });
  if (!ins_cancella) {
    throw new Error("Nessuna inserzione");
  }

  return ins_cancella;
};

module.exports = Inserzione;
