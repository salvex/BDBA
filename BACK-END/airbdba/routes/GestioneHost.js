var express = require("express");
var router = express.Router();
const HostControl = require("../controller/HostControl");
const ContattaQuestura = require("../controller/ContattaQuesturaControl");
const FileUpload = require("../utils/FileUpload");
const ContattaQuesturaControl = require("../controller/ContattaQuesturaControl");

router.get("/become", HostControl.become_host_get);
router.post(
  "/crea_ins/:type/:id",
  FileUpload.upFiles,
  HostControl.aggiungi_inserzione_post
);

router.get("/", HostControl.visualizza_inserzioni_get);

router.put("/modifica/", HostControl.modifica_inserzione_put);

router.put(
  "/modifica/:type/:id",
  FileUpload.upFiles,
  HostControl.modifica_inserzione_put_img
);

router.delete("/delete", HostControl.cancella_inserzione_delete);

router.get("", ContattaQuesturaControl.contattaQuestura_get);
router.post("", ContattaQuesturaControl.contattaQuestura_post);

module.exports = router;
