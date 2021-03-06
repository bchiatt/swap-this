'use strict';

var bcrypt  = require('bcrypt'),
    Mongo   = require('mongodb'),
    _       = require('lodash'),
    fs      = require('fs'),
    path    = require('path'),
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

User.getLocations = function(cb){
  User.collection.find({}, {email:1, location:1, lat:1, lng:1}).toArray(cb);
};

User.prototype.save = function(fields, file, cb){
  var properties = Object.keys(fields),
      self       = this;

  properties.forEach(function(property){
    console.log (fields[property]);
    self[property] = fields[property][0];
  });

  this.photo = uploadPhoto(file, '/img/' + this._id);

  User.collection.save(this, cb);
};

User.prototype.send = function(receiver, message, cb){
  sendInternal(this._id, receiver._id, message, cb);
};

User.prototype.unread = function(cb){
  Message.unread(this._id, cb);
};

User.prototype.messages = function(cb){
  Message.messages(this._id, cb);
};

module.exports = User;

// PRIVATE FUNCTIONS //

function sendInternal(from, to, subject, message, cb){
  var msg = new Message({frId:from, toId:to, subject:subject, body:message});
  msg.save(cb);
}

function uploadPhoto(photo, relDir){
  var baseDir = __dirname + '/../static',
      absDir  = baseDir + relDir;

  if(!fs.existsSync(absDir)){fs.mkdirSync(absDir);}

  if(!photo.photo[0].size){return;}

  var ext      = path.extname(photo.photo[0].path),
      name     = 'photo' + ext,
      absPath  = absDir + '/' + name,
      relPath  = relDir + '/' + name;
  fs.renameSync(photo.photo[0].path, absPath);
  return relPath;
}
