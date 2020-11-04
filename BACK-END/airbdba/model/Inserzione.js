const { Sequelize, DataTypes, Op } = require("sequelize");
const db = require("../utils/connection");
const Utente = require("./Utente");
const Prenotazione = require("./Prenotazione");
const Servizi = require("./Servizi");
const Moment = require("moment");
const MomentRange = require("moment-range");

const moment = MomentRange.extendMoment(Moment);

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
      type: DataTypes.DATEONLY(),
      allowNull: false,
    },
    fineDisponibilita: {
      type: DataTypes.DATEONLY(),
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
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    indirizzo: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    prezzo_base: {
      type: DataTypes.INTEGER(30),
      allowNull: false,
    },
    tassa_soggiorno: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    galleryPath: {
      type: DataTypes.STRING(1000),
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

// ASSOCIAZIONE [1-1]
Inserzione.hasOne(Servizi, {
  foreignKey: "ref_inserzione_s",
  onDelete: "cascade",
});
Servizi.belongsTo(Inserzione, {
  foreignKey: "ref_inserzione_s",
});

//---------ASSOCIAZIONE [1-N] // INSERZIONE-PRENOTAZIONE-------------------//
Inserzione.hasMany(Prenotazione, {
  as: "prenotazioni",
  foreignKey: "ref_inserzione",
  onDelete: "cascade",
});
Prenotazione.belongsTo(Inserzione, {
  foreignKey: "ref_inserzione",
});

//ASSOCIAZIONE [1-MOLTI]-------
Utente.hasMany(Inserzione, {
  foreignKey: "ref_host_ins",
  onDelete: "cascade",
});
Inserzione.belongsTo(Utente, {
  foreignKey: "ref_host_ins",
});

Inserzione.verRicerca = async (query, checkin, checkout) => {
  const lista = await Inserzione.findAll({
    where: query,
    include: [
      {
        model: Servizi,
        required: false,
      },
      {
        model: Prenotazione,
        as: "prenotazioni",
        required: false,
        where: {
          stato_prenotazione: {
            [Op.gte]: 1,
          },
        },
        attributes: ["ref_inserzione", "check_in", "check_out"],
      },
    ],
  });

  let listaFinale = [];

  function checkDates(pren) {
    let checkinPren = Date.parse(pren.check_in);
    let checkoutPren = Date.parse(pren.check_out);
    let checkinComp = Date.parse(checkin);
    let checkoutComp = Date.parse(checkout);
    let range = moment().range(checkinPren, checkoutPren);
    if (
      range.contains(checkinComp) == true ||
      range.contains(checkoutComp) == true
    ) {
      return false;
    } else {
      return true;
    }
  }

  if (lista) {
    lista.forEach((inserzione) => {
      if (inserzione.prenotazioni.length === 0) {
        listaFinale.push(inserzione);
      } else {
        if (inserzione.prenotazioni.every(checkDates)) {
          listaFinale.push(inserzione);
        }
      }
    });
    return listaFinale;
  }
  throw new Error("Nessuna inserzione");
};

Inserzione.aggiungiInserzioneServizi = async (
  nome_inserzione,
  citta,
  inizioDisponibilita,
  fineDisponibilita,
  n_ospiti,
  descrizione,
  indirizzo,
  prezzo_base,
  tassa_soggiorno,
  ref_host_ins,
  galleryPath,
  servizi
) => {
  const newIns = await Inserzione.create({
    nome_inserzione,
    citta,
    inizioDisponibilita,
    fineDisponibilita,
    n_ospiti,
    descrizione,
    indirizzo,
    prezzo_base,
    tassa_soggiorno,
    ref_host_ins,
    galleryPath,
  });

  const services = await Servizi.create({
    ref_inserzione_s: newIns.id_inserzione,
    wifiFlag: servizi["wifi"],
    riscaldamentoFlag: servizi["riscaldamento"],
    frigoriferoFlag: servizi["frigorifero"],
    casaFlag: servizi["casa"],
    bnbFlag: servizi["bnb"],
    parcheggioFlag: servizi["parcheggio"],
    ascensoreFlag: servizi["ascensore"],
    cucinaFlag: servizi["cucina"],
    essenzialiFlag: servizi["essenziali"],
    piscinaFlag: servizi["piscina"],
  });
  return newIns;
};

//Funzione temporanea
Inserzione.mostra = async (idInserzione) => {
  const risultato = await Inserzione.findOne({
    where: {
      id_inserzione: idInserzione,
    },
    include: [
      {
        model: Servizi,
        required: true,
      },
      {
        model: Utente,
        required: true,
        attributes: ["nome", "cognome", "imagePath"],
      },
    ],
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
      "inizioDisponibilita",
      "fineDisponibilita",
      "n_ospiti",
      "descrizione",
      "indirizzo",
      "prezzo_base",
      "tassa_soggiorno",
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
    include: {
      model: Servizi,
      required: true,
    },
  });
  if (lista) {
    return lista;
  }
  throw new Error("Nessuna inserzione");
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
