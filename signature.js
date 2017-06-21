var jsSHA = require("jssha");

module.exports = {
  signString: function (str, secret = process.env.DIMELO_SECRET_KEY) {
    let shaObj = new jsSHA("SHA-512", "TEXT");
    shaObj.setHMACKey(secret, "TEXT");
    shaObj.update(str);
    return shaObj.getHMAC("HEX");
  }
};
