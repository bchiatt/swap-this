'use strict';

var bcrypt  = require('bcrypt'),
    Mongo   = require('mongodb'),
    _       = require('lodash'),
    Mailgun = require('mailgun-js'),
    Message = require('./message.js');

function User(){
}

Object.defineProperty(User, 'collection', {
  get: function(){return global.mongodb.collection('users');}
});

User.register = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, user){
    if(user){return cb();}
    o.password = bcrypt.hashSync(o.password, 10);
    User.collection.save(o, cb);
  });
};

User.authenticate = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, user){
    if(!user){return cb();}
    var isOk = bcrypt.compareSync(o.password, user.password);
    if(!isOk){return cb();}
    cb(user);
  });
};

User.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  User.collection.findOne({_id:_id}, function(err, obj){
    cb(err, _.create(User.prototype, obj));
  });
};

User.findOne = function(filter, cb){
  User.collection.findOne(filter, cb);
};

User.prototype.save = function(o, cb){
  var properties = Object.keys(o),
      self       = this;

  properties.forEach(function(property){
    self[property] = o[property];
  });
  User.collection.save(this, cb);
};
//added switch statement JR - We may not need it
User.prototype.send = function(receiver, obj, cb){
  switch(obj.mtype){
    case 'text':
      sendText(receiver.phone, obj.message, cb);
      break;
    case 'email':
      sendEmail(this.email, receiver.email, obj.subject, obj.message, cb);
      break;
    case 'internal':
      sendInternal(this._id, receiver._id, obj.subject, obj.message, cb);
      break;
  }
};

//we don't need this if we keep the switch statement above

 /* Message.send(this._id, receiver._id, obj.message, cb);
};*/

User.prototype.unread = function(cb){
  Message.unread(this._id, cb);
};

User.prototype.messages = function(cb){
  Message.messages(this._id, cb);
};

module.exports = User;
//Added helper functions - JR
function sendText(to, body, cb){
  if(!to){return cb();}

  var accountSid = process.env.TWSID,
      authToken  = process.env.TWTOK,
      from       = process.env.FROM,
      client     = require('twilio')(accountSid, authToken);

  client.messages.create({to:to, from:from, body:body}, cb);
}

function sendEmail(from, to, subject, html, cb){
  if(!to){return cb();}

  var mailgun = new Mailgun({apiKey:process.env.MGAPI, domain:process.env.MGDOM}),
      data    = {from:from, to:to, subject:subject, html:html};

  mailgun.messages().send(data, cb);
}

function sendInternal(from, to, subject, message, cb){
  var msg = new Message({frId:from, toId:to, subject:subject, body:message});
  msg.save(cb);
}
