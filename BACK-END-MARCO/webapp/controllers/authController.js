const User = require("../models/User");
const sequelize = require("../db/config");
const jwt = require("jsonwebtoken");

const errorsHandler = (err) => {
  let errors = { nome: "", cognome: "", email: "", password: "" };

  if (err.message === "email errata" || err.message === "password errata") {
    errors.email = errors.password =
      "Credenziali di accesso errate o inesistenti";
  }

  if (err.message.includes("Validation error")) {
    Object.values(err.errors).forEach((error) => {
      console.log(error.message);
      errors[error.path] = error.message;
    });
  }

  return errors;
};

const maxAge = 60 * 60 * 24;
const createToken = (id) => {
  return jwt.sign({ id }, "mysupersecret", { expiresIn: maxAge });
};

const signup_get = (req, res) => {
  res.render("signup");
};

const signup_post = async (req, res) => {
  const { nome, cognome, email, password } = req.body;

  try {
    const user = await User.create({
      nome,
      cognome,
      email,
      password,
    });
    const token = createToken(user.id);
    res.cookie("jwt", token, { httpOnly: true, expiresIn: maxAge * 1000 });
    res.status(201).json({ user });
  } catch (err) {
    const errors = errorsHandler(err);
    res.status(400).json({ errors });
  }
};
const login_get = (req, res) => {
  res.render("login");
};

const login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user.id);
    res.cookie("jwt", token, { httpOnly: true, expiresIn: maxAge * 1000 });
    res.status(200).json({ user });
  } catch (err) {
    const errors = errorsHandler(err);
    res.status(400).json({ errors });
  }
};

const logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports = { signup_get, signup_post, login_get, login_post, logout_get };
