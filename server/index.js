const winston = require('winston');
const express = require('express');

const app = express();

require('./startup/loging')();
require('./startup/routes')(app);
require('./startup/database')();
require('./startup/config')();

const port = process.env.PORT || 5000
app.listen(port, () => winston.info(`server running in port ${port}`))
