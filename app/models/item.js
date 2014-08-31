'use strict';

var Mongo  = require('mongodb'),
    _      = require('lodash'),
    fs     = require('fs'),
    path   = require('path'),
    async  = require('async');


function Item(ownerId, o){
  this._id          = Mongo.ObjectID();
  this.name         = o.name[0];
  this.description  = o.description[0];
  this.isAvailable  = (o.isAvailable[0]==='true') ? true : false;
  this.ownerId      = ownerId;
  this.tags         = o.tags[0].trim().split(',').map(function(i){return i.trim();});
  this.bid          = null;
  this.bids         = [];
  this.photos       = [];
}

Object.defineProperty(Item, 'collection', {
  get: function(){return global.mongodb.collection('items');}
});

Item.create = function(ownerId, fields, files, cb){
  var i = new Item(ownerId, fields);
  i.photos = moveFiles(files, 0, '/img/' + i._id);
  Item.collection.save(i, cb);
};

Item.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Item.collection.findOne({_id:_id}, function(err, obj){
    cb(err, _.create(Item.prototype, obj));
  });
};

Item.find = function(filter, cb){
  Item.collection.find(filter).toArray(cb);
};

Item.query = function(query, cb){
  var limit  = 5,
      skip   = query.page ? ((query.page * limit) - limit)     : 0,
      filter = query.tag  ? {tags:query.tag}                   : {},
      sort   = {};
  if(query.sort){sort[query.sort] = query.direction * 1;}

  Item.collection.find(filter).sort(sort).skip(skip).limit(limit).toArray(cb);
};

Item.findBids = function(userId, cb){
  var ownerId = Mongo.ObjectID(userId);
  Item.collection.find({ownerId:ownerId, bid:null}, {name:1}).toArray(cb);
};

Item.offerCount = function(userId, cb){
  var ownerId = Mongo.ObjectID(userId);
  Item.collection.find({ownerId:ownerId, bids: {$not: {$size: 0}}}).count(cb);
};

/*Item.findPending = function(ownerId, cb){
  console.log('ownerId in Item.findPending>>>> ', ownerId);
  var pending = [],
      pubItem = [];
  Item.collection.find({ownerId:ownerId, isAvailble:true}).toArray(function(err, availableItems){
    async.map(availableItems, iterator, cb(pending, pubItem));
  });
};*/

Item.findOffers = function(ownerId, cb){
  Item.collection.find({ownerId:ownerId, bids: {$not: {$size: 0}}}).toArray(function(err, pending){
    async.map(pending, function(pend, cb){
      async.map(pend.bids, function(bid, cb){
        Item.findById(bid, function(err, item){
          pend = {pend:pend, item:item};
          cb(err, pend);
        });
      }, cb);
    }, cb);
  });
};

Item.prototype.update = function(fields, files, cb){
  var properties = Object.keys(fields),
      self       = this;
  properties.forEach(function(property){
    self[property] = fields[property][0];
  });
  var oldphotos = this.photosphotos,
      newphotos = moveFiles(files, oldphotos.length, '/img/' + this._id);
  this.photos = oldphotos.concat(newphotos);
  this.isAvailable  = (this.isAvailable==='true') ? true : false;
  this.tags         = this.tags.trim().split(',').map(function(i){return i.trim();});
  Item.collection.save(this, cb);
};

Item.prototype.bid = function(bidId, cb){
  this.bids.push(bidId._id);
  Item.collection.save(this, cb);
};

Item.prototype.cancelBids = function(cb){
  this.bids = [];
  Item.collection.save(this, cb);
};

Item.prototype.accept = function(bidItem, cb){
  var winner = bidItem.ownerId;
  bidItem.ownerId = this.ownerId;
  this.ownerId = winner;
  Item.collection.save(this, function(){
    Item.collection.save(bidItem, cb);
  });
};

Item.prototype.reject = function(){
};

module.exports = Item;

// PRIVATE FUNCTIONS //

function moveFiles(files, count, relDir){
  var baseDir = __dirname + '/../static',
      absDir  = baseDir + relDir;

  if(!fs.existsSync(absDir)){fs.mkdirSync(absDir);}

  var tmpPhotos = files.photo.map(function(photo, index){
    if(!photo.size){return;}

    var ext      = path.extname(photo.path),
        name     = count + index + ext,
        absPath  = absDir + '/' + name,
        relPath  = relDir + '/' + name;

    fs.renameSync(photo.path, absPath);
    return relPath;
  });

  return _.compact(tmpPhotos);
}

/*function iterator(item, pending, pubItem, cb){
  Item.collection.findOne({bids:![item._id]}, function(err, bid){
    if(bid){
      pending.push(item);
      cb();
    }else{
      pubItem.push(item);
      cb();
    }
  });
}*/
