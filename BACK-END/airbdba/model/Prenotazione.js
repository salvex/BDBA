const { Sequelize, DataTypes, Op } = require("sequelize");
const db = require("../utils/connection");
const moment = require("moment");
const Utente = require("../model/Utente");
const Inserzione = require("../model/Inserzione");
//TO-DO ASSOCIAZIONI : LE ASSOCIAZIONI SONO TUTTE UNA A MOLTI

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
    stato_ordine: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    ref_inserzione: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    check_in: {
      type: DataTypes.DATE(),
      allowNull: false,
    },
    check_out: {
      type: DataTypes.DATE(),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

//-------ASSOCIAZIONE [1-N] UTENTE-PRENOTAZIONE----------/
Utente.hasMany(Prenotazione, {
  as: "utente",
  foreignKey: "ref_utente",
});
Prenotazione.belongsTo(Utente, {
  foreignKey: "ref_utente",
});
//-------ASSOCIAZIONE [1-N] HOST-PRENOTAZIONE----------/
Utente.hasMany(Prenotazione, {
  as: "host",
  foreignKey: "ref_host",
});
Prenotazione.belongsTo(Utente, {
  foreignKey: "ref_host",
});
//-------ASSOCIAZIONE [1-N] HOST-PRENOTAZIONE----------/
Inserzione.hasMany(Prenotazione, {
  foreignKey: "ref_inserzione",
});
Prenotazione.belongsTo(Inserzione, {
  foreignKey: "ref_inserzione",
});

Prenotazione.getCheckInCheckOut = async (id_ins, id_ut) => {
  var yearBefore = moment().format("YYYY") - 1;
  var yearFuture = moment().format("YYYY") + 1;
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
    },
  });

  if (!result) {
    throw new Error("prenotazione inesistente");
  } else {
    return result;
  }
};

module.exports = Prenotazione;
