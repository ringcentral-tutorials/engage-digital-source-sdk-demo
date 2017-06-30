// REQUIRES
var express = require('express');
var bodyParser = require('body-parser');
var sign = require('./signature');
var Dimelo = require('./dimelo');

var app = express();
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.end('');
});

// handle post request
app.post('/', function(req, res) {
  // set content-type
  res.setHeader('Content-Type', 'application/json');

  if (!Dimelo.Request.validation.isValid(req.body)) {
    res.status(422).send({ error: 'Invalid action' });
    return;
  }

  // check if signature is present AND valid
  if ('x-smccsdk-signature' in req.headers && sign.isSigned(JSON.stringify(req.body), req.headers['x-smccsdk-signature'])) {
    // process request
    let response = JSON.stringify(Dimelo.Request.process(req.body));
    res.setHeader('X-SMCCSDK-SIGNATURE', sign.signString(response));
    res.end(response);
  }
  // bad signature
  else
    res.status(422).send({ error: 'Invalid signature' });
});

var port = Number(process.env.PORT || 3000);
app.listen(port);
