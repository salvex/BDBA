var express = require("express");
var router = express.Router();
const FileUpload = require("../utils/FileUpload");
const userController = require("../controller/UtenteControl");

router.get("/", userController.user_get, (req, res) => {
  res.render("user");
});

/* router.get("/profilo", userController.profilo_get); */
router.get("/modifica-password", userController.modificaPassword_get);
router.post("/modifica-password", userController.modificaPassword_post);
router.post("/metodo-pagamento", userController.metodoPagamento_post);
router.delete("/metodo-pagamento", userController.metodoPagamento_delete);
router.put(
  "/modifica-foto/:type/:id",
  [FileUpload.upFiles],
  userController.modificaFotoProfilo_put
);
router.post("/contatta-host", userController.contatta_host_post);
router.delete("/cancella-pren", userController.cancella_pren_user_delete);
/*router.post("/diventa-host", userController.diventaHost_post);
router.get("/profilo/foto-profilo", userController.fotoProfilo_get);
router.post("/profilo/foto-profilo", userController.fotoProfilo_post);*/

module.exports = router;
