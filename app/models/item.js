'use strict';

var Mongo  = require('mongodb'),
    _      = require('lodash');

function Item(o, ownerId){
  this.name         = o.name;
  this.photo        = o.photo;
  this.description  = o.description;
  this.isAvailable  = o.isAvailable;
  this.ownerId      = ownerId;
}

Object.defineProperty(Item, 'collection', {
  get: function(){return global.mongodb.collection('items');}
});

Item.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Item.collection.findOne({_id:_id}, function(err, obj){
    cb(err, _.create(Item.prototype, obj));
  });
};

Item.find = function(filter, cb){
  Item.collection.find(filter).toArray(cb);
};

Item.toggleIsAvailable = function(){
};

module.exports = Item;

