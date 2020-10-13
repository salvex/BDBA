const { Sequelize, DataTypes } = require("sequelize");
const db = require("../utils/connection");
const Prenotazione = require("../model/Prenotazione");
//TO-DO ASSOCIAZIONI : LE ASSOCIAZIONI SONO TUTTE UNA A MOLTI

const Ospite = db.sequelize.define(
  "ospite",
  {
    id_ospite: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    cognome: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    sesso: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    nazionalita: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    tipo_documento: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    data_nascita: {
      type: DataTypes.DATEONLY(),
      allowNull: false,
    },
    ref_prenotazione_u: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    isEsente: {
      type: DataTypes.INTEGER(1),
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

//----ASSOCIAZIONE [1-N] PRENOTAZIONE-OSPITE //
Prenotazione.hasMany(Ospite, {
  as: "ospiti",
  foreignKey: "ref_prenotazione_u",
});
Ospite.belongsTo(Prenotazione, {
  as: "ospiti",
  foreignKey: "ref_prenotazione_u",
});

module.exports = Ospite;
