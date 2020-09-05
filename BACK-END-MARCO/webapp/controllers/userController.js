const User = require("../models/User");
const jwt = require("jsonwebtoken");

const errorsHandler = (err) => {
  let error = { message: "" };
  if (err.message === "password non combaciano") {
    error.message = "La password immessa non combacia con la tua password";
  }
  if (err.message === "email non combacia") {
    error.message = "L'indirizzo email immesso non combacia con il tuo";
  }

  return error;
};

const user_get = (req, res) => {
  res.render("user");
};

const profilo_get = (req, res) => {
  res.render("profilo");
};

const modificaPassword_get = (req, res) => {
  res.render("modificaPassword");
};

const modificaPassword_post = async (req, res) => {
  const { email, vecchiaPsw, nuovaPsw } = req.body;
  try {
    const result = await User.modificaPassword(email, vecchiaPsw, nuovaPsw);
    console.log(result);
  } catch (err) {
    const error = errorsHandler(err);
    res.status(400).json({ error });
  }

  res.status(200).end();
};

module.exports = {
  user_get,
  profilo_get,
  modificaPassword_get,
  modificaPassword_post,
};
