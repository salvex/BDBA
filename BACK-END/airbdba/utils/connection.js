const Sequelize = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();
const db = {};
// PER SALVO: "ricordati di cambiare da new_airbdba a airbdba"
const sequelize = new Sequelize("airbdba", "bdba", "k^TQ8mjEj!6XD4Dt", {
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

db.testConnessione = (req, res, next) => {
  sequelize
    .authenticate()
    .then(() => {
      next();
    })
    .catch((err) => {
      res.status(404).render("schermataCadutaConnessione");
    });
};

// QUESTA FUNZIONE SERVE A SINCRONIZZARE AUTOMATICAMENTE IL DATABASE, INSERENDO LE TABELLE CORRETTE
// N.B: Bisogna prima creare uno schema corrispondente a quello assegnato!

 /*sequelize
  .sync()
  .then(() => console.log("sincronizzazione completata"))
  .catch((err) => console.log(err.message)); */

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
