//IMPORTANTE: I METODI D'INSERIMENTO O DI RICERCA CHE COINVOLGONO I DB ACCETTANO SOLO "POST" DA FETCH
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const dotenv = require("dotenv");
var moment = require("moment");
var session = require("express-session");
var sessionStore = require("./utils/sessionStore");
dotenv.config();
const PORT = process.env.PORT || 3001;
//AUTH MIDDLEWARE
const { checkUser, verifyToken } = require("./utils/JwtToken");
//Router init
var indexRouter = require("./routes/index");
var authRouter = require("./routes/Autenticazione");
var hostRouter = require("./routes/GestioneHost");
var utenteRouter = require("./routes/GestioneUtente");
var insRouter = require("./routes/MostraInserzione");
var recRouter = require("./routes/RecuperaPassword");
var regRouter = require("./routes/Registrazione");
var searchRouter = require("./routes/Ricerca");
var Prenotazione = require("./model/Prenotazione");
//---------Database--------------//
var mysql = require("mysql2");
const db = require("./utils/connection");
// CROSS-ORIGIN RESOURCE SHARING
var cors = require("cors");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//Cookie parser
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
//express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    unset: "destroy",
    cookie: {
      maxAge: 60 * 60 * 24,
    },
  })
);
//Cors
app.use(cors());
//Router
app.use("*", checkUser);
app.use("/", indexRouter);
app.use(authRouter);

/*app.get("/prenotazione/check/:id", async (req, res) => {
  try {
    const result = await Prenotazione.findAll({
      attributes: ["check_in", "check_out"],
      where: {
        ref_utente: req.session.utente.id,
        ref_inserzione: req.params.id,
      },
    });
    if (result == false) {
      console.log("nessuna prenotazione");
      res.status(400).end();
    } else {
      var giorniTotali = 0;
      result.forEach((date) => {
        giorniTotali += moment(date.check_out).diff(
          moment(date.check_in),
          "days"
        );
      });
      console.log(giorniTotali);

      if (giorniTotali < 28) {
        console.log("procedi con la prenotazione");
      } else {
        console.log("impossibile procedere con la prenotazione");
      }
      res.status(200).end();
    }
  } catch (err) {
    console.log(err);
    res.status(400).end();
  }
}); */
app.get("/data", (req, res) => {
  var annoCorrente = moment().format("YYYY");
  console.log(typeof (annoCorrente - 1));

  res.status(200).end();
});
app.use("/user", utenteRouter);
app.use("/registrazione", regRouter);
app.use("/host", hostRouter);
app.use("/inserzione", insRouter);
app.use("/recovery", recRouter);
app.use("/search", searchRouter);

// handler errore 404
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
});

app.listen(PORT, () => console.log("Server startato..porta: " + PORT));

module.exports = app;
