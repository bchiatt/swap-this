'use strict';

var Item    = require('../models/item'),
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
  res.render('items/index');
};
