var express = require("express");
var router = express.Router();
const HostControl = require("../controller/HostControl");
const ContattaQuestura = require("../controller/ContattaQuesturaControl");
const FileUpload = require("../utils/FileUpload");
const ContattaQuesturaControl = require("../controller/ContattaQuesturaControl");
const JwtToken = require("../utils/JwtToken");
const formidableMiddleware = require("express-formidable");

/* router.use(formidableMiddleware()); */

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
    res.render("host");
  }
);

router.put(
  "/modifica/:type/:id/:folder",
  [JwtToken.verifyHost],
  FileUpload.upFiles,
  HostControl.modifica_inserzione_put
);
/* 
router.put(
  "/modifica/:type/:id",
  [JwtToken.verifyHost],
  FileUpload.upFiles,
  HostControl.modifica_inserzione_put_img
); */

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

router.post("/turismo", HostControl.contatta_turismo_get);
router.post(
  "/turismo/rendiconta",
  formidableMiddleware(),
  HostControl.contatta_turismo_post
);

router.get("", ContattaQuesturaControl.contattaQuestura_get);
router.post("", ContattaQuesturaControl.contattaQuestura_post);

module.exports = router;
