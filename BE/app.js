var createError = require('http-errors');
var express = require('express');
var cors = require('cors')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cron = require('node-cron');
var connect = require('./config/mongoConnect');
var secret = require('./secret.js')

var authRouter = require('./routes/authRoutes')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var eventsRouter = require('./routes/events');
const passport = require('passport');
require('./services/passport');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cookieParser(secret.cookieSecret));
app.use(require("express-session")(secret.sessionSecret));

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

//Connect to Mongodb compass
connect.connectDB();

//daily crawling news will run on 00:00 every day
//node-cron document https://www.npmjs.com/package/node-cron
cron.schedule('0 0 * * *', () => {
  console.log('Daily send email for event ; ' + moment().format('MMMM Do YYYY, h:mm:ss a'));
  // check notification model for event need to send email
}, {
  scheduled: true,
  timezone: "Asia/Ho_Chi_Minh"
});

app.use('/', indexRouter);
// app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/events', eventsRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
