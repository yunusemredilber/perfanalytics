const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const metricsRouter = require('./routes/metrics');

require('dotenv').config()
const db = require('./db')
db()
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.text());

// Cors
const cors = require('cors')
app.use(cors())

app.use('/', indexRouter);
app.use('/metrics', metricsRouter);

app.use(express.static(path.join(__dirname, './perfanalytics-dashboard/build')));
['/dashboard', '/dashboard/*'].forEach(p => {
  app.get(p, (req, res) => {
    res.sendFile(path.resolve(__dirname, './perfanalytics-dashboard', 'build', 'index.html'));
  });
});

app.use(express.static(path.join(__dirname, './test-client-react/build')));
['/test', '/test/*'].forEach(p => {
  app.get(p, (req, res) => {
    res.sendFile(path.resolve(__dirname, './test-client-react', 'build', 'index.html'));
  });
});

app.get('/perfanalytics.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, './perfanalytics-js', 'bundle.js'));
});

module.exports = app;
