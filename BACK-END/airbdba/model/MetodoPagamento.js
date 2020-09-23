const {Sequelize, DataTypes} = require("sequelize");
const db = require('../utils/connection');
const Utente = require('../model/Utente');
//TO-DO ASSOCIAZIONI : LE ASSOCIAZIONI SONO TUTTE UNA A MOLTI



const MetodoPagamento = db.sequelize.define("metodo_pagamento", {
    ref_utente: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true
    },
    codice_carta: {
        type: DataTypes.INTEGER(20),
        allowNull: false,
    },
    intestatario: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    data_scadenza: {
        type: DataTypes.STRING(7),
        allowNull: false,
    },
    cvv: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

//--ASSOCIAZIONE [1-1] Utente - MetodoPagamento
Utente.hasOne(MetodoPagamento, {
    foreignKey : 'ref_utente'
})
MetodoPagamento.belongsTo(Utente, {
    foreignKey: 'ref_utente'
})


MetodoPagamento.getPagamento = async (id_utente) => {
    let metodo = MetodoPagamento.findByPk(id_utente);
    return metodo; 
}




MetodoPagamento.SetOrUpdate = async (
    user_id,
    intestatario,
    codice_carta,
    data_scadenza,
    cvv, 
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