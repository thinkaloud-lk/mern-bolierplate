const { mern_boilerplate_jwtPrivateKey } = require('../config');

module.exports = () => {
  if (!mern_boilerplate_jwtPrivateKey) {
    throw new Error('FATAL ERROR: mern_boilerplate_jwtPrivateKey not defined ')
  }

}