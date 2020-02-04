const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true,
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true
  },
  isAdmin: {
    type: Boolean,
  }

});

userSchema.methods.generateWebToken = function () {
  return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, process.env.mern_boilerplate_jwtPrivateKey)
}

const User = mongoose.model('User', userSchema);

const validateUserData = (data) => {
  return Joi.validate(data, {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).required().email(),
    password: Joi.string().min(5).max(255).required(),
  })
}

exports.User = User;
exports.validate = validateUserData;