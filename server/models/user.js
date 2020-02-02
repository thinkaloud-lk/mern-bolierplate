const mongoose = require('mongoose');
const bctypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const saltRounds = 10;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxLength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    maxLength: 5,
  },
  lastName: {
    type: String,
    maxLength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: Number
  }
});

userSchema.pre("save", function (next) {
  var user = this;
  if (user.isModified('password')) {

    bctypt.genSalt(saltRounds, (err, salt) => {
      if (err) return next(err);
      bctypt.hash(user.password, salt, (err, hash) => {
        if (err) next(err);
        user.password = hash;
        next()
      })
    })
  } else {
    next()
  }
})

userSchema.methods.compairPassword = function (plainPassword, callBack) {
  bctypt.compare(plainPassword, this.password, (err, success) => {
    if (err) callBack(err);
    callBack(null, success)
  })
}

userSchema.methods.generateToken = function (callBack) {
  const user = this;
  const token = jwt.sign(user._id.toHexString(), 'secret');
  user.token = token;
  user.save((err, user) => {
    if (err) callBack(err);
    console.log('user', user)
    callBack(null, user)
  })
}

userSchema.statics.findUserByToken = function (token, callBack) {
  const user = this;
  jwt.verify(token, 'secret', (err, userId) => {
    this.findOne({ '_id': userId, 'token': token }, (err, user) => {
      if (err) return callBack(err);
      return callBack(null, user);
    })
  })
}

const User = mongoose.model('User', userSchema);

module.exports = { User }