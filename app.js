/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const flash = require('express-flash');
const path = require('path');
const rfs = require('rotating-file-stream');
// initalize sequelize with session store
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');

// Set up logging directory
var logDirectory = path.join(__dirname, 'log');
var accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
});

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const rampController = require('./controllers/ramp');
const contactController = require('./controllers/contact');

/**
 * Create Express server.
 */
const app = express();


/**
 * Establish Sequelize connection
 */
const models = require('./models');
models.sequelize.sync({alter: true})
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(expressStatusMonitor());
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(logger('combined', {stream: accessLogStream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: false,
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  cookie: { maxAge: 1209600000 },
  proxy: true
}));
app.use(flash());
app.use((req, res, next) => {
  if (req.path === '/api/upload') {
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/qrScanner', homeController.qrScanner);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);

app.post('/occupyRamp/:id', rampController.occupyRamp);
app.post('/freeRamp/:id', rampController.freeRamp);
app.get('/rampOccupied/:id', rampController.rampOccupied);
app.post('/addToWaitingList/:id', rampController.addToWaitingList);
app.get('/getNumPeopleWaiting/:id', rampController.getNumPeopleWaiting);

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler());
}

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
