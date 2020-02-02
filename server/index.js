const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/keys');
const { User } = require('./models/user');
const { auth } = require('./middlewares/auth');

const app = express();

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('DB connected'))
  .catch(err => console.log('error connecting', err))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('server running'))

app.get('/api/users/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req._id,
    isAuth: true,
    //name: req.user.name,
    //lastName: req.usee.lastName,
    email: req.user.email,
    role: 0,
  })
})

app.post('/api/users/register', (req, res) => {
  const newUser = new User(req.body);
  newUser.save((err, user) => {
    if (err) return res.status(401).json({ success: false, error: err })
    return res.status(200).json({ success: true, user })
  })
})

app.post('/api/users/login', (req, res) => {
  User.findOne({ 'email': req.body.email }, (err, user) => {
    if (!user) return res.json({ loginSuccess: false, message: "User not found" })
    user.compairPassword(req.body.password, (err, isMatch) => {
      if (!isMatch) return res.json({ loginSuccess: false, message: 'Invalid credentials' })
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        return res.cookie('auth', user.token)
          .status(200)
          .json({ loginSuccess: true })
      })
    })
  })

})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { 'token': "" }, (err, doc) => {
    if (err) return res.json({ success: false })
    return res.status(200).json({ success: true })
  })
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`server running in port ${port}`))
