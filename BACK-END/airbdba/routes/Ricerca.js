var express = require("express");
var router = express.Router();
const RicercaControl = require("../controller/RicercaControl");



router.get("/", (req, res) => {
  res.render("schermataRicerca");
});

router.get("/res", RicercaControl.ricerca_get);

module.exports = router;
