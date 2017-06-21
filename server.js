// REQUIRES
var express = require('express');
var bodyParser = require('body-parser');
var sign = require('./signature');
var Dimelo = require('./dimelo');

// DIMELO SECRET
var secret = process.env.DIMELO_SECRET_KEY;

var app = express();
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('Vous êtes à l\'accueil');
});

// handle post request
app.post('/', function(req, res) {
  // set content-type to application/json
  res.setHeader('Content-Type', 'application/json');

  if (!validateAction(req.body)) {
    res.status(422).send({ error: 'Invalid action' });
    return;
  }

  // check if signature is present AND valid
  if ('x-smccsdk-signature' in req.headers /*&& req.headers['x-smccsdk-signature'] == sign.signString(JSON.stringify(req.body))*/) {
    // process request
    var response = JSON.stringify(processDimeloRequest(req.body));
    res.setHeader('X-SMCCSDK-SIGNATURE', sign.signString(response));
    res.end(response);
  }
  else { // bad signature
    res.status(422).send({ error: 'Invalid signature' });
  }
});

function parseAction(str) {
  var action_reg = /(\w+)\.(\w+)/;
  var matched = str.match(action_reg);
  if (matched) {
    var object = matched[1];
    var action = matched[2];

    return {"object": object, "action": action};
  }
  return {};
}

// check if the body is valid or not
function validateAction(body) {
  // in case there is no action parameter in the request
  if (!('action' in body))
    return false;

  var action_str = JSON.stringify(body.action);
  // we doesn't need to go further if action is implementation.info
  if (action_str === 'implementation.info')
    return true;

  // fills a hash with the object type and the action
  var action_hash = parseAction(action_str);

  // cannot perform a create action without a params parameter
  if (action_hash.action === 'create' && !('params' in body))
    return false;

  // check if the request consists of one valid object and one valid action
  return ["messages", "private_messages", "threads"].includes(action_hash.object) && ["create", "list", "show"].includes(action_hash.action);
}

// handle the request by calling the appropriate function
function processDimeloRequest(body) {
  // regex to match action format
  var action_reg = /(\w+)\.(\w+)/;
  var matched = body.action.match(action_reg);

  // if there's an action parameter
  if ('action' in body && matched) {
    // if action IS implementation.info
    if (body.action === 'implementation.info') {
      return Dimelo.implementation_info.handle();
    }
    // if action IS something else (e.g. messages.list, private_messages.create ...)
    else {
      var object_type = matched[1];
      var action = matched[2];

      // call create with the params to insert new message in db otherwise calls the action without parameter
      return action === 'create' ? Dimelo[object_type].create(body.params) : Dimelo[object_type][action].call();
    }
  }
}

app.listen(8080);
