const { Sequelize, DataTypes, Op } = require("sequelize");
const db = require("../utils/connection");
const moment = require("moment");
const Utente = require("./Utente");

const Prenotazione = db.sequelize.define(
  "prenotazione",
  {
    id_prenotazione: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ref_host: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    ref_utente: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    stato_prenotazione: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    ref_inserzione: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    check_in: {
      type: DataTypes.DATEONLY(),
      allowNull: false,
    },
    check_out: {
      type: DataTypes.DATEONLY(),
      allowNull: false,
    },
    prezzo_finale: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    n_ospiti_pren: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    questuraFlag: {
      type: DataTypes.INTEGER(1),
      defaultValue: 0,
      allowNull: false,
    },
    turismoFlag: {
      type: DataTypes.INTEGER(1),
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

//-------ASSOCIAZIONE [1-N] UTENTE-PRENOTAZIONE (PARTE UTENTE)----------/
Utente.hasMany(Prenotazione, {
  as: "prenotazioni_u",
  foreignKey: "ref_utente",
});
Prenotazione.belongsTo(Utente, {
  foreignKey: "ref_utente",
});

//DA VEDERE

//-------ASSOCIAZIONE [1-N] UTENTE-PRENOTAZIONE (PARTE HOST)----------/
Utente.hasMany(Prenotazione, {
  as: "prenotazioni_h",
  foreignKey: "ref_host",
});
Prenotazione.belongsTo(Utente, {
  foreignKey: "ref_host",
});

Prenotazione.getCheckInCheckOut = async (id_ins, id_ut) => {
  let yearBefore = moment().format("YYYY") - 1;
  let yearFuture = moment().format("YYYY") + 1;
  const result = await Prenotazione.findAll({
    attributes: ["check_in", "check_out"],
    where: {
      ref_utente: id_ut,
      ref_inserzione: id_ins,
      check_in: {
        [Op.gte]: Date.parse(yearBefore),
        [Op.lte]: Date.parse(moment().endOf("year")),
      },
      check_out: {
        [Op.lte]: Date.parse(moment().add(1, "y").endOf("year")),
        [Op.gte]: Date.parse(moment().format("YYYY")),
      },
      stato_prenotazione: {
        [Op.gte]: 1,
      },
    },
  });
  return result;
};

Prenotazione.getPrenotazioni = async (id_ins) => {
  let result = await Prenotazione.findAll({
    //risultato dell'interrogazione che viene passato nel foreach
    attributes: ["id_prenotazione", "check_in", "check_out"],
    where: {
      ref_inserzione: id_ins,
      stato_prenotazione: {
        [Op.gte]: 1,
      },
    },
  });
  return result;
};

Prenotazione.getUserMail = async (id_pren, id_host) => {
  let result = await Prenotazione.findOne({
    where: {
      id_prenotazione: id_pren,
      //ref_host: id_host
    },
    include: [{ model: Utente, required: true, attributes: ["email"] }],
  });
  if (result) {
    return result;
  } else {
    throw new Error("nessun utente associato");
  }
};

Prenotazione.getEmails = async (id_ins) => {
  let MailArray = [];
  const prenAss = await Prenotazione.findAll({
    where: {
      ref_inserzione: id_ins,
      stato_prenotazione: {
        [Op.gte]: 1,
      },
    },
    include: {
      model: Utente,
      required: true,
      attributes: ["email"],
    },
  });
  if (prenAss) {
    prenAss.forEach(async (pren) => {
      MailArray.push(pren.utente.email);
    });
    return MailArray;
  } else {
    throw new Error("prenotazioni non trovate");
  }
};

module.exports = Prenotazione;
