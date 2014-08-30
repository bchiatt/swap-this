'use strict';

var User    = require('../models/user'),
    mp      = require('multiparty'),
    Item    = require('../models/item'),
    Message = require('../models/message');

exports.new = function(req, res){
  res.render('users/new');
};

exports.login = function(req, res){
  res.render('users/login');
};

exports.logout = function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
};

exports.create = function(req, res){
  User.register(req.body, function(err, user){
    if(user){
      res.redirect('/login');
    }else{
      res.redirect('/register');
    }
  });
};

exports.authenticate = function(req, res){
  User.authenticate(req.body, function(user){
    debugger;
    if(user){
      req.session.regenerate(function(){
        req.session.userId = user._id;
        req.session.save(function(){
          res.redirect('/profile');
        });
      });
    }else{
      res.redirect('/login');
    }
  });
};

exports.edit = function(req, res){
  res.render('users/edit');
};

exports.update = function(req, res){
  var form = new mp.Form();
  form.parse(req, function(err, fields, files){
    res.locals.user.save(fields, files, function(){
      res.redirect('/profile');
    });
  });
};

exports.home = function(req, res){
  res.render('users/home');
};

exports.send = function(req, res){
  User.findById(req.params.userId, function(err, receiver){
    res.locals.user.send(receiver, req.body, function(){
      res.redirect('/users/' + receiver.email);
    });
  });
};

exports.messages = function(req, res){
  res.locals.user.messages(function(err, msgs){
    res.render('users/messages', {msgs:msgs});
  });
};

exports.message = function(req, res){
  Message.read(req.params.msgId, function(err, msg){
    res.render('users/message', {msg:msg});
  });
};
