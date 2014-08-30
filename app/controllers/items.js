'use strict';

var Item    = require('../models/item'),
    User    = require('../models/user'),
    mp      = require('multiparty');

exports.new = function(req, res){
  res.render('items/new');
};

exports.create = function(req, res){
  var form = new mp.Form();
  form.parse(req, function(err, fields, files){
    console.log('THIS IS FIELDS & FILES', fields, files);
    Item.create(res.locals.user._id, fields, files, function(){
      res.redirect('/profile');
    });
  });
};

exports.index = function(req, res){
  Item.query(req.query, function(err, items){
    console.log('THIS IS ITEMS', items);
    res.render('items/index', {items:items});
  });
};

exports.show = function(req, res){
  Item.findById(req.params.itemId, function(err, item){
    User.findById(item.ownerId, function(err, client){
      res.render('items/show', {item:item, client:client});
    });
  });
};
