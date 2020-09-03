const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.user_get);
router.get("/profilo", userController.profilo_get);
router.get("/profilo/modifica-password", userController.modificaPassword_get);
router.post("/profilo/modifica-password", userController.modificaPassword_post);

module.exports = router;
