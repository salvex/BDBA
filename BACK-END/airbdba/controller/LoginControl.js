
const Utente = require("../model/Utente");
require("dotenv").config();
const JwtToken = require("../utils/JwtToken");


const maxAge = 60 * 60 * 24;

var errorsHandler = (err) => {
  let errors = { email: "", password: "" };

  if (err.message === "email errata" || err.message === "password errata") {
    errors.email = errors.password =
      "Credenziali di accesso errate o inesistenti";
  }

  if (err.message.includes("Validation error")) {
    Object.values(err.errors).forEach((error) => {
      errors[error.path] = error.message;
    });
  }

  return errors;
};


const login_post = async (req, res) => {
  try {
    const { email, password } = req.body;

    var utente = await Utente.Autentica(email, password);

    var token = JwtToken.createToken(utente.id);

    res.cookie("jwt", token, { httpOnly: true, expiresIn: maxAge * 1000 });
    if (utente.isHost == 1) {
      var token_host = JwtToken.createTokenHost(utente.id);
      res.cookie("host", token_host, {
        httpOnly: true,
        expiresIn: maxAge * 1000,
      });
    }
    req.session.utente = utente;

    res.status(200).json({ success: true });
  } catch (err) {
    const errors = errorsHandler(err);
    res.status(400).json({ errors });
  }
};

const login_get = (req, res) => {
  if (req.cookies.jwt) {
    res.redirect("/");
  } else {
    res.render("schermataAutenticazione");
  }
};

module.exports = { login_post, login_get };
