var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var session = require('express-session');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');
var adminLoginRouter = require('./routes/admin/login');
var adminSolicitudesRouter = require('./routes/admin/solicitudes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

var fileUpload = require('express-fileupload');
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// Session para el admin
app.use(session({
  secret: 'carrigo_admin_secret',
  resave: false,
  saveUninitialized: true
}));

// ========== RUTAS ==========

// API (frontend)
app.use('/api', apiRouter);

// Admin
app.use('/admin/login', adminLoginRouter);
app.use('/admin', adminSolicitudesRouter);

// Al entrar a http://localhost:3001 → ir al login de admin
app.get('/', function (req, res) {
  res.redirect('/admin/login');
});

// Otras rutas (si las usás)
app.use('/users', usersRouter);
app.use('/', indexRouter);

// catch 404
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;