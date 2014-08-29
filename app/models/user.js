'use strict';

var bcrypt  = require('bcrypt'),
    Mongo   = require('mongodb'),
    _       = require('lodash'),
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

User.prototype.send = function(receiver, obj, cb){
  Message.send(this._id, receiver._id, obj.message, cb);
};

User.prototype.unread = function(cb){
  Message.unread(this._id, cb);
};

User.prototype.messages = function(cb){
  Message.messages(this._id, cb);
};

module.exports = User;

