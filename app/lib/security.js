'use strict';

var User    = require('../models/user'),
    Item    = require('../models/item'),
    Message = require('../models/message');

exports.authenticate = function(req, res, next){
  if(!req.session.userId){return next();}

  User.findById(req.session.userId, function(err, user){
    Message.unread(req.session.userId, function(err, count){
      Item.offerCount(req.session.userId, function(err, offers){
        user.offers = offers;
        user.unread = count;
        res.locals.user = user;
        next();
      });
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

