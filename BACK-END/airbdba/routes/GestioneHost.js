var express = require("express");
var router = express.Router();
const HostControl = require("../controller/HostControl");
const ContattaQuestura = require("../controller/ContattaQuesturaControl");
const FileUpload = require("../utils/FileUpload");
const ContattaQuesturaControl = require("../controller/ContattaQuesturaControl");
const JwtToken = require("../utils/JwtToken");


router.get("/become",  HostControl.become_host_get);

router.post(
  "/crea_ins/:type/:id",
  FileUpload.upFiles,
  HostControl.aggiungi_inserzione_post
);

router.get("/", [JwtToken.verifyHost], HostControl.visualizza_inserzioni_get);

router.put("/modifica/", [JwtToken.verifyHost], HostControl.modifica_inserzione_put);

router.put(
  "/modifica/:type/:id",
  [JwtToken.verifyHost],
  FileUpload.upFiles,
  HostControl.modifica_inserzione_put_img
);

router.delete("/delete_ins", [JwtToken.verifyHost], HostControl.cancella_inserzione_delete);

router.get("/accetta/:id_pren", [JwtToken.verifyHost], HostControl.accetta_prenotazione_get );

router.get("/rifiuta/:id_pren", [JwtToken.verifyHost], HostControl.rifiuta_prenotazione_get );

router.delete("/delete_pren/:id_pren", [JwtToken.verifyHost], HostControl.cancella_prenotazione_delete);

router.get("/contact/:id_pren", [JwtToken.verifyHost], HostControl.contatta_utente_get);


router.get("", ContattaQuesturaControl.contattaQuestura_get);
router.post("", ContattaQuesturaControl.contattaQuestura_post);

module.exports = router;
