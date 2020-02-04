const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { MONGO_URI } = require('./config');
const home = require('./routes/home');
const collection = require('./routes/collection')
//debugger 
const serverDebugger = require('debug')('app:server')
const dbDebugger = require('debug')('app:db')

const app = express();

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => dbDebugger('DB connected'))
  .catch(err => dbDebugger('error connecting', err))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use('/api/collection', collection);
app.use('/', home);

const port = process.env.PORT || 5000
app.listen(port, () => serverDebugger(`server running in port ${port}`))
