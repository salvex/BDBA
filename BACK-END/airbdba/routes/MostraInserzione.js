var express = require("express");
var router = express.Router();
const JwtToken = require("../utils/JwtToken");
const ShowInsControl = require("../controller/ShowInsControl");
const PrenotazioneControl = require("../controller/PrenotazioneControl");

router.get("/", (req, res) => {
  res.render("insertion");
});

router.get("/res", ShowInsControl.mostra_get);

router.get(
  "/prenota",
  [JwtToken.verifyToken],
  PrenotazioneControl.effettua_pren_get
);

router.post("/prenota/identify", [JwtToken.verifyToken],PrenotazioneControl.identifica_ospiti_post) 

// IN QUESTA ROTTA BISOGNA RENDERIZZARE IL RIEPILOGO
router.get("/prenota/summary", [JwtToken.verifyToken],PrenotazioneControl.pagamento_get)

//router.get("")


// localhost:3000/inserzione/prenota/identify

module.exports = router;
