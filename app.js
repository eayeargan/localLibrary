const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const pizzaRouter = require('./routes/pizza');
const catalogRouter = require('./routes/catalog');
const mgdbCreds = require('./db_creds/creds');
const compression = require("compression");
const helmet = require("helmet");


const app = express();
/*
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowsMs: 1*60*1000,
  max: 20
});
*/
//Connect to MGDB
const mongoose = require('mongoose');
const mgdb_url = require('./db_creds/creds');
mongoose.set('strictQuery', false);
const dev_db_url = mgdb_url;
const mongoDB = process.env.MONGODB_URI || dev_db_url;

main().catch((err)=>console.log(err));
async function main(){
  await mongoose.connect(mongoDB);
  //console.log('attempting to connect to mgdb')
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(limiter)
app.use(helmet.contentSecurityPolicy({
  directives:{
    "script-src":["'self'", "code.jquery.com","cdn.jsdelivr.net"],
  },
}));
app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);
app.use('/pizza', pizzaRouter);

// catch 404 and forward to error handler
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
  res.render('error');
});

module.exports = app;
