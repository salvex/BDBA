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
var HostControl = require("./controller/GestioneHostControl");
var schedule = require("node-schedule");

dotenv.config();
const PORT = process.env.PORT || 3000;
//AUTH MIDDLEWARE
const { checkUser, verifyToken, verifyHost } = require("./utils/JwtToken");
//Router init
var indexRouter = require("./routes/SchermataPrincipale");
var authRouter = require("./routes/Autenticazione");
var hostRouter = require("./routes/GestioneHost");
var utenteRouter = require("./routes/GestioneUtente");
var insRouter = require("./routes/MostraInserzione");
var regRouter = require("./routes/Registrazione");
var searchRouter = require("./routes/Ricerca");
//---------Database--------------//
var mysql = require("mysql2");
const db = require("./utils/connection");
// CROSS-ORIGIN RESOURCE SHARING IMPORT
var cors = require("cors");
var app = express();
//NODEMAILER
var transporter = require("./utils/mailSender");
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
//test connessione
app.use("*", db.testConnessione);
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
var rule = new schedule.RecurrenceRule();
rule.hour = 12;
var scheduleJob1 = schedule.scheduleJob(rule, checkRendiconto);
var scheduleJob2 = schedule.scheduleJob(rule, checkPrenotazioneData);

app.use("/profilo", verifyToken, utenteRouter);
app.use("/signup", regRouter);
app.use("/host", verifyToken, hostRouter);
app.use("/inserzione", insRouter);
app.use("/search", searchRouter);
app.get("/become", HostControl.become_host_get);

// error 404
app.use(function (req, res) {
  res.status(404).render("schermataErrore");
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
