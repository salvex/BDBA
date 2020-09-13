const db = require("./connection");
var session = require("express-session");
var SequelizeStore = require("connect-session-sequelize")(session.Store);

const sessionStore = new SequelizeStore({
  db: db.sequelize,
  tableName: "sessioni",
});

module.exports = sessionStore;
