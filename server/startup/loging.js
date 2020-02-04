const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

const { MONGO_URI } = require('../config');

module.exports = () => {
  //to handle errors outside of the express
  winston.exceptions.handle(
    new winston.transports.File({ filename: 'uncaughtExceptions.log' }),
    new winston.transports.Console({ level: 'error' })
  );

  //log errors in local file and mongo
  winston.add(new winston.transports.File({ filename: 'logfile.log' }))
  winston.add(new winston.transports.MongoDB({
    db: MONGO_URI,
    level: 'info'
  }))
}