const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI,
  mern_boilerplate_jwtPrivateKey: process.env.mern_boilerplate_jwtPrivateKey,
}