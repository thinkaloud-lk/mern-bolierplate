const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const { User, validate } = require('../models/user');


//register a user
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  const { name, email, password } = req.body;
  if (error) return res.status(400).send(error.details[0].message)

  let user = await User.findOne({ email })
  if (user) return res.status(400).send("User already registered")

  user = new User({ name, email, password });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user = await user.save();
  res.header('x-auth-token', user.generateWebToken()).send(_.pick(user, ['_id', 'name', 'email']));
})

module.exports = router;