const Utente = require("../model/Utente");
const MetodoPagamento = require("../model/MetodoPagamento");
const { decodedId } = require("../utils/JwtToken");

const errorsHandler = (err) => {
  let error = { message: "" };
  if (err.message === "password non combaciano") {
    error.message = "La password immessa non combacia con la tua password";
  }
  if (err.message === "email non combacia") {
    error.message = "L'indirizzo email immesso non combacia con il tuo";
  }
  if (err.message === "metodo non cambiato") {
    error.message = "None e' stato possibile modificare il metodo di pagamento";
  }

  return error;
};

const user_get = (req, res) => {
  res.render("user");
};

/* const profilo_get = (req, res) => {
  res.render("profilo");
}; */

const modificaPassword_get = (req, res) => {
  res.render("modificaPassword");
};

const modificaPassword_post = async (req, res) => {
  const { email, vecchiaPsw, nuovaPsw } = req.body;
  try {
    const result = await Utente.modificaPassword(email, vecchiaPsw, nuovaPsw);
    console.log(result);
    res.status(200).json({ success: true });
  } catch (err) {
    const error = errorsHandler(err);
    res.status(400).json({ error });
  }

  res.status(200).end();
};

const metodoPagamento_get = (req, res) => {
  res.render("metodoPagamento");
};

const metodoPagamento_post = async (req, res) => {
  const UserId = decodedId(req);
  const {
    nomeInt,
    cognomeInt,
    ccn,
    cvv,
    meseScadenza,
    annoScadenza,
  } = req.body;

  try {
    const result = await MetodoPagamento.SetUpdate(
      UserId,
      nomeInt,
      cognomeInt,
      ccn,
      cvv,
      meseScadenza,
      annoScadenza
    );
    console.log(result);
    res.status(200).json({ result });
  } catch (err) {
    const error = errorsHandler(err);
    res.status(400).json({ error });
  }
};

const modificaFotoProfilo_put = async (req, res) => {
  try {
    console.log(req.body);
    let path = req.files["avatar"][0].path;
    let user = await Utente.findByPk(req.session.utente.id);
    user.imagePath = path;
    await user.save();
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ err });
  }
};

module.exports = {
  user_get,
  // profilo_get,
  modificaPassword_get,
  modificaPassword_post,
  metodoPagamento_post,
  metodoPagamento_get,
  modificaFotoProfilo_put,
  //diventaHost_post,
};
