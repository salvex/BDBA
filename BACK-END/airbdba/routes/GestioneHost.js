var express = require('express');
var router = express.Router();
const JwtToken = require('../utils/JwtToken');
const HostControl = require('../controller/HostControl');
const FileUpload = require('../utils/FileUpload');

//router.get('/', [JwtToken.verifyToken,JwtToken.verifyHost], HostControl.visualizza_ins_get);
router.get('/become', [JwtToken.verifyToken], HostControl.become_host_get);
router.post('/crea_ins/:type/:id', [JwtToken.verifyToken],[JwtToken.verifyHost], FileUpload.upFiles, HostControl.aggiungi_inserzione_post);
router.get('/', [JwtToken.verifyToken], [JwtToken.verifyHost], HostControl.visualizza_inserzioni_get);
router.put('/modifica/:type/:id',  [JwtToken.verifyToken], [JwtToken.verifyHost], FileUpload.upFiles, HostControl.modifica_inserzione_put);
router.delete('/delete',  [JwtToken.verifyToken], [JwtToken.verifyHost], HostControl.cancella_inserzione_delete);


module.exports = router;
