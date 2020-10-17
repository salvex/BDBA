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
router.get("/metodo-pagamento", userController.metodoPagamento_get);
router.post("/metodo-pagamento", userController.metodoPagamento_post);
router.put(
  "/modifica-foto/:type/:id",
  [FileUpload.upFiles],
  userController.modificaFotoProfilo_put
);
/*router.post("/diventa-host", userController.diventaHost_post);
router.get("/profilo/foto-profilo", userController.fotoProfilo_get);
router.post("/profilo/foto-profilo", userController.fotoProfilo_post);*/

module.exports = router;
