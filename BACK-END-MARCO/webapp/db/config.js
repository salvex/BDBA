const Sequelize = require("sequelize");

const sequelize = new Sequelize("webapp", "root", "", {
  host: "localhost",
  dialect: "mysql",
  /*define: {
    freezeTableName: true,
  },
  /*createdAt: false,
  updatedAt: false,*/
});

module.exports = sequelize;
