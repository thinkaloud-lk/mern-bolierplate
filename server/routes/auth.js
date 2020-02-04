const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const { User } = require('../models/user');

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) return res.status(400).send("Invalid email or password");

  res.send(user.generateWebToken());
})

const validate = (data) => {
  return Joi.validate(data, {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  })

}

module.exports = router;