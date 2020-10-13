//IMPORTANTE: I METODI D'INSERIMENTO O DI RICERCA CHE COINVOLGONO I DB ACCETTANO SOLO "POST" DA FETCH
var createError = require("http-errors");
var express = require("express");
var favicon = require("serve-favicon");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const dotenv = require("dotenv");
var moment = require("moment");
var session = require("express-session");
var sessionStore = require("./utils/sessionStore");
var { checkRendiconto } = require("./utils/checkRendiconto");
var { checkPrenotazioneData } = require("./utils/checkPrenotazioneData");
var HostControl = require("./controller/HostControl");

dotenv.config();
const PORT = process.env.PORT || 3001;
//AUTH MIDDLEWARE
const { checkUser, verifyToken, verifyHost } = require("./utils/JwtToken");
//Router init
var indexRouter = require("./routes/index");
var authRouter = require("./routes/Autenticazione");
var hostRouter = require("./routes/GestioneHost");
var utenteRouter = require("./routes/GestioneUtente");
var insRouter = require("./routes/MostraInserzione");
var recRouter = require("./routes/RecuperaPassword");
var regRouter = require("./routes/Registrazione");
var searchRouter = require("./routes/Ricerca");
//var Prenotazione = require("./model/Prenotazione");
//---------Database--------------//
var mysql = require("mysql2");
const db = require("./utils/connection");
// CROSS-ORIGIN RESOURCE SHARING IMPORT
var cors = require("cors");
var app = express();
//NODEMAILER
var transporter = require("./utils/mailSender");
console.log(transporter);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//FAVICON
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
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
      maxAge: 60 * 60 * 24 * 1000,
    },
  })
);
//Cors USE
app.use(cors());
//Router
app.use("*", checkUser);
app.use("/", indexRouter);
app.use(authRouter);
//CONTROLLI GLOBALI
setInterval(checkRendiconto, 60 * 60 * 24 * 1000);
setInterval(checkPrenotazioneData, 60 * 60 * 24 * 1000);

/*app.get("/data", (req, res) => {
  var annoCorrente = moment().format("YYYY");
  console.log(typeof moment().format("YYYY"));

  res.status(200).end();
});
app.get("/prova", (req, res) => {
  if (req.session.utente) {
    res.send(req.session.utente);
  } else {
    res.send("nessuno utente loggato");
  }
});*/

app.use("/profilo", verifyToken, utenteRouter);
app.use("/signup", regRouter);
app.use("/host", verifyToken, hostRouter);
app.use("/inserzione", insRouter);
app.use("/recovery", recRouter);
app.use("/search", searchRouter);
app.get("/become", HostControl.become_host_get);

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

app.listen(PORT, () => console.log("Server in ascolto sulla porta: " + PORT));

module.exports = app;
