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
    type: DataTypes.STRING(16),
    validate: {
      len: {
        args: [8, 16],
        msg: "Lunghezza password invalida",
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
module.exports = User;
