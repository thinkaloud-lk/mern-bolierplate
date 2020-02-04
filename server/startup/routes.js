const express = require('express');
const home = require('../routes/home');
const collection = require('../routes/collection')
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middlewares/error');

module.exports = (app) => {
  app.use(express.json());
  app.use('/', home);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/api/collection', collection);
  app.use(error);
}