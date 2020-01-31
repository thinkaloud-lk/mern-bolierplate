const express = require('express');
const mongoose = require('mongoose');

const app = express();
const uris = "mongodb+srv://thinkaloud:M0!aMala@cluster0-fi8fh.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(uris, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('DB connected'))
  .catch(err => console.log('error connecting', err))

app.listen(5000, () => console.log('server running in 5000'))

app.get('/', (req, res) => {
  res.send('Hello ado')
})