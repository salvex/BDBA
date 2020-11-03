var express = require("express");
var router = express.Router();
const HostControl = require("../controller/HostControl");
const FileUpload = require("../utils/FileUpload");
const JwtToken = require("../utils/JwtToken");
const formidableMiddleware = require("express-formidable");


router.put(
  "/crea_ins/:type/:id/:folder",
  [JwtToken.verifyHost],
  [FileUpload.upFiles],
  HostControl.aggiungi_inserzione_post
);

router.get(
  "/",
  [JwtToken.verifyHost],
  HostControl.gestione_host_get,
  (req, res) => {
    res.render("schermataGestioneHost");
  }
);

router.put(
  "/modifica/:type/:id/:folder",
  [JwtToken.verifyHost],
  FileUpload.upFiles,
  HostControl.modifica_inserzione_put
);


router.delete(
  "/delete_ins",
  [JwtToken.verifyHost],
  HostControl.cancella_inserzione_delete
);

router.get(
  "/accetta/:id_pren",
  [JwtToken.verifyHost],
  HostControl.accetta_prenotazione_get
);

router.get(
  "/rifiuta/:id_pren",
  [JwtToken.verifyHost],
  HostControl.rifiuta_prenotazione_get
);

router.delete(
  "/delete_pren/:id_pren",
  [JwtToken.verifyHost],
  HostControl.cancella_prenotazione_delete
);

router.post(
  "/contact/:id_pren",
  [JwtToken.verifyHost],
  HostControl.contatta_utente_post
);

router.get("/identifica-ospiti", (req, res) => {
  res.render("schermataIdentificaOspiti");
});
router.post("/identifica-ospiti", HostControl.identifica_post);

router.post("/turismo", HostControl.contatta_turismo_get);
router.post(
  "/turismo/rendiconta",
  formidableMiddleware(),
  HostControl.contatta_turismo_post
);

router.post(
  "/questura",
  formidableMiddleware({ multiples: true }),
  HostControl.contatta_questura_post
);

module.exports = router;
