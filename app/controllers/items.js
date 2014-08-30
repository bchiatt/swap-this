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
    Item.create(res.locals.user._id, fields, files, function(){
      res.redirect('/profile');
    });
  });
};

exports.index = function(req, res){
  Item.query(req.query, function(err, items){
    User.getLocations(function(err, locations){
      res.render('items/index', {items:items, locations:locations});
    });
  });
};

exports.show = function(req, res){
  Item.findById(req.params.itemId, function(err, item){
    User.findById(item.ownerId, function(err, client){
      res.render('items/show', {item:item, client:client});
    });
  });
};

exports.newBid = function(req, res){
  Item.findById(req.params.itemId, function(err, item){
    Item.findBids(res.locals.user._id, function(err, bids){
      res.render('items/bid', {item:item, bids:bids});
    });
  });
};

exports.bid = function(req, res){
  res.locals.user.bid(req.params.itemId, req.params.bidId, function(){
    res.redirect('/items/' + req.params.itemId);
  });
};

exports.edit = function(req, res){
  Item.findById(req.params.itemId, function(err, item){
    res.render('items/edit', {item:item});
  });
};

exports.update = function(req, res){
  var form = new mp.Form();
  form.parse(req, function(err, fields, files){
    Item.findById(req.params.itemId, function(err, item){
      item.update(fields, files, function(err, cb){
        res.redirect('/profile');
      });
    });
  });
};

exports.offers = function(req, res){
  Item.findPending(req.params.itemId, function(err, saleItem){
    Item.findById(req.params.itemId2, function(err, bidItem){
      res.render('items/offers', {saleItem:saleItem, bidItem:bidItem});
    });
  });
};

exports.accept = function(req, res){
  res.locals.user.accept(req.params.itemId, req.params.bidId, function(){
    res.redirect('/offers');
  });
};

exports.reject = function(req, res){
  res.locals.user.reject(req.params.itemId, req.params.bidId, function(){
    res.redirect('/offers');
  });
};
