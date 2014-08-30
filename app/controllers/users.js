'use strict';

var User    = require('../models/user'),
    mp      = require('multiparty'),
    moment  = require('moment'),
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
  Item.find({ownerId:res.locals.user._id, isAvailable:true}, function(err, pubItems){
    console.log('pubItems in exports.home>>>>> ', pubItems);
    Item.find({ownerId:res.locals.user._id, isAvailable:false}, function(err, privItems){
      console.log('privItems in exports.home>>>>> ', privItems);
      res.render('users/home', {pubItems:pubItems, privItems:privItems});
    });
  });
};

exports.send = function(req, res){
  User.findById(req.params.userId, function(err, receiver){
    Message.send(res.locals.user._id, receiver._id, req.body, function(){
      res.redirect('/users/' + receiver.email);
    });
  });
};

exports.client = function(req, res){
  User.findOne({email:req.params.email}, function(err, client){
    if(client){
      res.render('users/client', {client:client});
    }else{
      res.redirect('/profile');
    }
  });
};

exports.messages = function(req, res){
  res.locals.user.messages(function(err, messages){
    console.log(messages);
    res.render('users/messages', {messages:messages, moment:moment});
  });
};

exports.message = function(req, res){
  Message.read(req.params.msgId, function(err, message){
    res.render('users/message', {message:message, moment:moment});
  });
};
