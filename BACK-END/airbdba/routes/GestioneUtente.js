var express = require("express");
var router = express.Router();
const FileUpload = require("../utils/FileUpload");
const userController = require("../controller/GestioneUtenteControl");

router.get("/", userController.user_get, (req, res) => {
  res.render("schermataGestioneUtente");
});

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

module.exports = router;
