const Sequelize = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();
const db = {};
// PER SALVO: "ricordati di cambiare da new_airbdba a airbdba"
const sequelize = new Sequelize("new_airbdba", "root", "", {
  host: "127.0.0.1",
  dialect: "mysql",
  timezone: "Europe/Rome",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connesso al database!");
  })
  .catch((err) => {
    console.log("Connessione al database fallita!");
  });

// QUESTA FUNZIONE SERVE A SINCRONIZZARE AUTOMATICAMENTE IL DATABASE, INSERENDO LE TABELLE CORRETTE 
// N.B: Bisogna prima creare uno schema corrispondente a quello assegnato!

/*sequelize
  .sync()
  .then(() => console.log("sincronizzazione completata"))
  .catch((err) => console.log(err.message));*/

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
