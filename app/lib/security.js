'use strict';

var User    = require('../models/user'),
    Message = require('../models/message');

exports.authenticate = function(req, res, next){
  if(!req.session.userId){return next();}

  User.findById(req.session.userId, function(err, user){
    Message.unread(req.session.userId, function(err, count){
      user.unread = count;
      res.locals.user = user;
      next();
    });
  });
};

exports.bounce = function(req, res, next){
  if(res.locals.user){
    next();
  }else{
    res.redirect('/login');
  }
};

