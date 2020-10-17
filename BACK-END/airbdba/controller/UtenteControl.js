const Utente = require("../model/Utente");
const MetodoPagamento = require("../model/MetodoPagamento");
const Prenotazione = require("../model/Prenotazione");
const Inserzione = require("../model/Inserzione");

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

const user_get = async (req, res, next) => {
  try {
    const prenotazioni = await Prenotazione.findAll({
      where: { ref_utente: req.session.utente.id },
      include: [
        {
          model: Inserzione,
          required: true,
        },
      ],
    });
    const metodiPagamento = await MetodoPagamento.findAll({
      where: { ref_utente: req.session.utente.id },
    });
    res.locals.prenotazioni = JSON.stringify(prenotazioni);
    res.locals.metodiPagamento = JSON.stringify(metodiPagamento);
    next();
  } catch (error) {
    res.status(400).json({ success: false });
  }
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
  try {
    const {
      intestatario,
      codice_carta,
      nome_circuito,
      cvv,
      scadenza_mese,
      scadenza_anno,
    } = req.body.metodo;
    let scadenza = scadenza_mese + "/" + scadenza_anno;
    var metodo_pagamento = await MetodoPagamento.create({
      ref_utente: req.session.utente.id,
      intestatario: intestatario,
      codice_carta: codice_carta,
      nome_circuito: nome_circuito,
      data_scadenza: scadenza,
      cvv: cvv,
    });
    res.status(200).json({ success: true });
  } catch (err) {
    const error = errorsHandler(err);
    res.status(400).json({ error });
  }
};

const metodoPagamento_delete = async (req, res) => {
  try {
    await MetodoPagamento.destroy({ where: { id_metodo: req.query.id } });
    res.status(200).json({ success: true });
  } catch {
    const error = errorsHandler(err);
    res.status(400).json({ error });
  }
};

const modificaFotoProfilo_put = async (req, res) => {
  try {
    console.log(req.body.formData);
    let path = req.files["avatar"][0].path;
    let user = await Utente.findByPk(req.session.utente.id);
    user.imagePath = path.replace(/\\/g, "/");
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
  metodoPagamento_delete,
  metodoPagamento_get,
  modificaFotoProfilo_put,
  //diventaHost_post,
};
