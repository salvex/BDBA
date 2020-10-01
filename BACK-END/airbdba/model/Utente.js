const { Sequelize, DataTypes, JSONB } = require("sequelize");
const db = require("../utils/connection");
const bcrypt = require("bcrypt");
//TO-DO mettere un validate, modificare allowNull per tutti gli attributi tranne id
//TO-DO ASSOCIAZIONI : LE ASSOCIAZIONI SONO TUTTE UNA A MOLTI

const Utente = db.sequelize.define(
  'utente',
  {
    id: {
      type: DataTypes.INTEGER(50),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    cognome: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    imagePath: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    isHost: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },
    ultimo_rendiconto: {
      type: DataTypes.DATEONLY(),
    }, 
    hostBecomeAt: {
      type: DataTypes.DATEONLY(),
    }
    /*    indirizzo: {
        type: DataTypes.STRING(80),
        allowNull: false
    },
    data_nascita: {
        type: DataTypes.DATEONLY,
        validate: {
            notEmpty: {
              msg: "Inserisci una data",
            },
          },
    }, 
    numero_telefonico: {
        type: DataTypes.INTEGER,
        
    },*/
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

//-------ASSOCIAZIONE [1-N] UTENTE-PRENOTAZIONE----------/
/*Utente.hasMany(Prenotazione, {
  //as: 'user',
  foreignKey: "ref_utente",
});
Prenotazione.belongsTo(Utente, {
  foreignKey: "ref_utente",
});*/


Utente.Autentica = async (emailutente, password) => {
  console.log("Login in corso..");
  const utente = await Utente.findOne({ where: { email: emailutente } });
  if (utente) {
    const auth = await bcrypt.compare(password, utente.password);
    if (auth) {
      return utente;
    }
    throw new Error("password errata");
  }
  throw new Error("email errata");
};

Utente.modificaPassword = async (email, vecchiaPsw, nuovaPsw) => {
  const user = await Utente.findOne({ where: { email } });
  if (user) {
    const confronto = await bcrypt.compare(vecchiaPsw, user.password);
    console.log("confronto: ", confronto);
    if (confronto) {
      const salt = await bcrypt.genSalt();
      nuovaPsw = await bcrypt.hash(nuovaPsw, salt);

      const result = await Utente.update(
        { password: nuovaPsw },
        {
          where: {
            email,
          },
        }
      );
      return result;
    }
    throw new Error("password non combaciano");
  }
  throw new Error("email non cambacia");
};

Utente.diventaHost = async (user_id) => {
  const host = await Utente.findOne({ where: { id: user_id } });
  if (!host) {
    throw Error("Utente non trovato");
  }
  host.isHost = 1;
  await host.save();

  return host;
};

module.exports = Utente;
