const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/keys');
const { User } = require('./models/user');

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

app.post('/api/users/register', (req, res) => {
  const newUser = new User(req.body);
  newUser.save((err, doc) => {
    if (err) return res.status(401).json({ success: false, error: err })
    return res.status(200).json({ success: true })
  })
})

app.listen(4000, () => console.log('server running in 4000'))
