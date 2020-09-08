var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 5000;
//AUTH MIDDLEWARE
const {checkUser,verifyToken} = require("./utils/JwtToken");
//Router init
var indexRouter = require('./routes/index');
var authRouter = require('./routes/Autenticazione');
var hostRouter = require('./routes/GestioneHost');
var utenteRouter = require('./routes/GestioneUtente');
var insRouter = require('./routes/MostraInserzione');
var recRouter = require('./routes/RecuperaPassword');
var regRouter = require('./routes/Registrazione');
var searchRouter = require('./routes/Ricerca');
//---------Database--------------//
var mysql = require('mysql2');
const db = require('./utils/connection');
// CROSS-ORIGIN RESOURCE SHARING
var cors = require('cors');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//Cookie parser
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//Cors
app.use(cors());
//Router
app.use('*', checkUser);
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', utenteRouter);
app.use('/regpage', regRouter);
app.use('/host', hostRouter);
app.use('/inserzione', insRouter);
app.use('/recovery', recRouter);
app.use('/search', searchRouter); 



// handler errore 404
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
});

app.listen(PORT, () => console.log("Server startato..porta: " + PORT) );


module.exports = app;
