// generate token using secret from process.env.JWT_SECRET
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');

// generate token and return it
function generateTokenOng(ong) {
  //1. Don't use password, email and other sensitive fields
  //2. Use the information that are useful in other parts
  if (!ong) return null;

  /*
    OBS: If a callback is supplied, most jwt methods become asynchronous. If not, they are synchronous
  */

  return jwt.sign(ong, process.env.JWT_SECRET, {//As there is no callback, this is synchronous
    expiresIn: 60*60*3
  });
}

function decode(jwt){
  return jwtDecode(jwt);
}

module.exports = {
  generateTokenOng,
  decode
}