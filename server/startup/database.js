const mongoose = require('mongoose');
const winston = require('winston');
const { MONGO_URI } = require('../config');

module.exports = () => {
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => winston.info('DB connected'))
}