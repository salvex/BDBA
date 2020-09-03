const User = require("../models/User");

const errorsHandler = (err) => {
  let error = { message: "" };
  if (err.message === "password non combaciano") {
    error.message = "La password immessa non combacia con la tua password";
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
  const user = req.app.get("user");
  console.log(user.email);
  const { vecchiaPsw, nuovaPsw } = req.body;
  try {
    const result = await User.modificaPassword(
      user.email,
      user.password,
      vecchiaPsw,
      nuovaPsw
    );
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
