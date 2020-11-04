const { Sequelize, DataTypes } = require("sequelize");
const db = require("../utils/connection");
const Utente = require("../model/Utente");

const MetodoPagamento = db.sequelize.define(
  "metodo_pagamento",
  {
    id_metodo: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    ref_utente: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    nome_circuito: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    codice_carta: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    intestatario: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    data_scadenza: {
      type: DataTypes.STRING(7),
      allowNull: false,
    },
    cvv: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

//--ASSOCIAZIONE [1-1] Utente - MetodoPagamento
Utente.hasMany(MetodoPagamento, {
  foreignKey: "ref_utente",
});
MetodoPagamento.belongsTo(Utente, {
  foreignKey: "ref_utente",
});

MetodoPagamento.get_metodi = async (id_utente) => {
  let metodi = MetodoPagamento.findAll({ where: { ref_utente: id_utente } });
  return metodi;
};

MetodoPagamento.SetOrUpdate = async (
  user_id,
  intestatario,
  codice_carta,
  data_scadenza,
  cvv
) => {
  var result;
  try {
    result = await MetodoPagamento.findByPk(user_id);
    console.log(result);
  } catch (err) {
    console.log(err);
  }

  if (result) {
    try {
      result.codice_carta = codice_carta;
      result.intestatario = intestatario;
      result.data_scadenza = data_scadenza;
      result.cvv = cvv;
      await result.save();
      return result;
    } catch (err) {
      console.log(err);
    }
  } else {
    try {
      let ref_utente = user_id;
      const metodo = await MetodoPagamento.create({
        ref_utente,
        codice_carta,
        intestatario,
        data_scadenza,
        cvv,
      });
      return metodo;
    } catch (err) {
      console.log(err);
    }
  }
  throw new Error("metodo non cambiato");
};

module.exports = MetodoPagamento;
