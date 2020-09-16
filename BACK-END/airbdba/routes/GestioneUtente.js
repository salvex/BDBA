var express = require("express");
var router = express.Router();
const userController = require("../controller/UtenteControl");

router.get("/", userController.user_get);
router.get("/profilo", userController.profilo_get);
router.get("/profilo/modifica-password", userController.modificaPassword_get);
router.post("/profilo/modifica-password", userController.modificaPassword_post);
router.get("/profilo/metodo-pagamento", userController.metodoPagamento_get);
router.post("/profilo/metodo-pagamento", userController.metodoPagamento_post);
/*router.post("/diventa-host", userController.diventaHost_post);
router.get("/profilo/foto-profilo", userController.fotoProfilo_get);
router.post("/profilo/foto-profilo", userController.fotoProfilo_post);*/

module.exports = router;
