var express = require("express");
var router = express.Router();
const HostControl = require("../controller/HostControl");
const FileUpload = require("../utils/FileUpload");

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

module.exports = router;
