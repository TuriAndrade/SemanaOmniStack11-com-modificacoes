// generate token using secret from process.env.JWT_SECRET
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');

// generate token and return it
function generateToken(json, secret, expiresInSeconds) {
  //1. Don't use password, email and other sensitive fields
  //2. Use the information that are useful in other parts
  if (!json) return null;

  /*
    OBS: If a callback is supplied, most jwt methods become asynchronous. If not, they are synchronous
  */

  if(secret){
    return jwt.sign(json, secret, {//As there is no callback, this is synchronous
      expiresIn: expiresInSeconds
    });
  }else{
    return null;
  }
}

function decode(jwt){
  return jwtDecode(jwt);
}

function generateRandomString(length = 10){
  return Math.random().toString(20).substr(2, length);
}

module.exports = {
  generateToken,
  decode,
  generateRandomString
}