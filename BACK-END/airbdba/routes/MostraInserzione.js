var express = require("express");
var router = express.Router();
const JwtToken = require("../utils/JwtToken");
const ShowInsControl = require("../controller/InserzioneControl");
const PrenotazioneControl = require("../controller/PrenotazioneControl");

router.get("/:id", ShowInsControl.mostra_get, (req, res) => {
  res.render("schermataInserzione");
});

router.get(
  "/prenota/riepilogo",
  [JwtToken.verifyToken],
  PrenotazioneControl.riepilogo_get,
  (req, res) => {
    res.render("schermataRiepilogo");
  }
);
router.get(
  "/prenota/pagamento",
  [JwtToken.verifyToken],
  PrenotazioneControl.pagamento_get,
  (req, res) => {
    res.render("schermataPagamento");
  }
);

router.get(
  "/prenota/:id/:giorni_da_pren",
  [JwtToken.verifyToken],
  PrenotazioneControl.effettua_pren_get
);

router.post(
  "/prenota/pagamento",
  [JwtToken.verifyToken],
  PrenotazioneControl.pagamento_post
);

router.post(
  "/prenota/riepilogo",
  [JwtToken.verifyToken],
  PrenotazioneControl.riepilogo_post
);

module.exports = router;
