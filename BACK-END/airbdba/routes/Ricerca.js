var express = require("express");
var router = express.Router();
const RicercaControl = require("../controller/RicercaControl");

/* router.post("/", RicercaControl.ricerca_post);

router.post("/res", RicercaControl.ricerca_get);
 */

router.get("/", (req, res) => {
  res.render("search");
});

router.get("/res", RicercaControl.ricerca_get);

module.exports = router;
