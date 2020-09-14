var express = require("express");
var router = express.Router();
const JwtToken = require("../utils/JwtToken");
const ShowInsControl = require("../controller/ShowInsControl");
const PrenotazioneControl = require("../controller/PrenotazioneControl");

router.get("/res", ShowInsControl.mostra_get);

router.get(
  "/prenota/:id",
  [JwtToken.verifyToken],
  PrenotazioneControl.effettua_pren_get
);

module.exports = router;
