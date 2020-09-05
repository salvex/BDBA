const { Sequelize, DataTypes, json } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../db/config");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },

  nome: {
    type: DataTypes.STRING(200),
    validate: {
      notEmpty: {
        msg: "Inserisci un nome",
      },
    },
  },

  cognome: {
    type: DataTypes.STRING(200),
    validate: {
      notEmpty: {
        msg: "Inserisci un cognome",
      },
    },
  },

  email: {
    type: DataTypes.STRING(50),
    unique: { msg: "Email già registrata" },
    validate: {
      isEmail: {
        msg: "Inserisci un indirizzo email valido",
      },
    },
  },

  password: {
    type: DataTypes.STRING(100),
    validate: {
      len: {
        args: [8, 100],
        msg: "Lunghezza password non valida",
      },
    },
  },
});

User.beforeSave(async (user) => {
  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(user.password, salt);
});

User.login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw new Error("password errata");
  }
  throw new Error("email errata");
};

User.modificaPassword = async (email, vecchiaPsw, nuovaPsw) => {
  const user = await User.findOne({ where: { email } });
  if (user) {
    const confronto = await bcrypt.compare(vecchiaPsw, user.password);
    console.log("confronto: ", confronto);
    if (confronto) {
      const salt = await bcrypt.genSalt();
      nuovaPsw = await bcrypt.hash(nuovaPsw, salt);

      const result = await User.update(
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

module.exports = User;
