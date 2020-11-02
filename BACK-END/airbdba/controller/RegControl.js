const Utente = require("../model/Utente");
const JwtToken = require("../utils/JwtToken");
var bcrypt = require("bcrypt");

const maxAge = 60 * 60 * 24;

//TODO: SOSTITUIRE TUTTI i messaggi res.send con l'attributo "message"
var errorsHandler = (err) => {
  let errors = {
    nome: "",
    cognome: "",
    email: "",
    password: "",
    indirizzo: "",
    data_nascita: "",
    numero_telefonico: "",
  };

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

const registrazione_get = (req, res) => {
  if (req.cookies.jwt) {
    res.redirect("/");
  } else {
    res.render("schermataRegistrazione");
  }
};

const registrazione_post = (req, res) => {
  console.log("Registrazione in corso...");

  Utente.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((utente) => {
      if (utente) {
        res.cookie("jwt", "", { maxAge: 1 });
        res.status(400).json({ errors: "questa email è già stata utilizzata" });
      } else {
        Utente.create({
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 8),
          nome: req.body.nome,
          cognome: req.body.cognome,
          imagePath: null,
          /*    indirizzo: req.body.indirizzo, //
                data_nascita: req.body.datanascita,
                numero_telefonico: req.body.numerotel */
        })
          .then((utente) => {
            var token = JwtToken.createToken(utente.id, utente.isHost);
            res.cookie("jwt", token, {
              httpOnly: true,
              expiresIn: maxAge * 1000,
            });
            req.session.utente = utente;
            /* res.locals.user = utente; */
            console.log(req.session.utente);
            res.status(200).json({ utente });
          })
          .catch((err) => {
            res.status(500).json("Errore! -> " + err);
          });
      }
    })
    .catch((err) => {
      const errors = errorsHandler(err);
      return res.status(500).json(errors);
    });
};

module.exports = { registrazione_get, registrazione_post };
