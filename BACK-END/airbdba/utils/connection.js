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

sequelize
  .sync()
  .then(() => console.log("sincronizzazione completata"))
  .catch((err) => console.log(err.message));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
