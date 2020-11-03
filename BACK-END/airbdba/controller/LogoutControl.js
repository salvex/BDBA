require("dotenv").config();

const logout_get = (req, res) => {
  if (req.cookies.jwt) {
    res.cookie("jwt", "", { maxAge: 1 });
    res.cookie("host", "", { maxAge: 1 });
    req.session.destroy();
    res.redirect("/");
  } else {
    res.redirect("/");
  }
};

module.exports = { logout_get };
