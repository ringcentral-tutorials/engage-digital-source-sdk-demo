var jsSHA = require("jssha");

module.exports = {
  // returns the signature of the string using HMAC SHA-512 algorithm with the DIMELO_SECRET_KEY as secret
  signString: function(str, secret = process.env.DIMELO_SECRET_KEY) {
    let shaObj = new jsSHA("SHA-512", "TEXT");
    shaObj.setHMACKey(secret, "TEXT");
    shaObj.update(str);
    return shaObj.getHMAC("HEX");
  },

  // returns true if the signature is valid, false otherwise
  isSigned: function(body, signature) {
    if (process.env.NO_SIGN_CHECK)
      return true;
    return this.signString(body) == signature;
  }
};
