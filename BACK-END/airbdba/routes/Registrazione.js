var express = require("express");
var router = express.Router();
const RegControl = require("../controller/RegistrazioneControl.js");

router.get("/", RegControl.registrazione_get);

router.post("/", RegControl.registrazione_post);

module.exports = router;
