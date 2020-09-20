var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var metricsRouter = require('./routes/metrics');

require('dotenv').config()
var db = require('./db')
db()
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Cors
var cors = require('cors')
app.use(cors())

app.use('/', indexRouter);
app.use('/metrics', metricsRouter);

module.exports = app;
