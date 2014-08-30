'use strict';

var Mongo  = require('mongodb'),
    _      = require('lodash'),
    fs     = require('fs'),
    path   = require('path');


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

Item.prototype.update = function(fields, files, cb){
  var properties = Object.keys(fields),
      self       = this;
  properties.forEach(function(property){
    self[property] = fields[property][0];
  });
  var oldphotos = this.photos,
      newphotos = moveFiles(files, oldphotos.length, '/img/' + this._id);
  this.photos = oldphotos.concat(newphotos);
  Item.collection.save(this, cb);
};

Item.toggleIsAvailable = function(){
};

module.exports = Item;

// PRIVATE FUNCTIONS //

function moveFiles(files, count, relDir){
  var baseDir = __dirname + '/../static',
      absDir  = baseDir + relDir;

  if(!fs.existsSync(absDir)){fs.mkdirSync(absDir);}
  console.log('FILES in moveFILES>>>>>  :', files);
  console.log('FILES.PHOTO in moveFILES>>>>>  :', files.photo);

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

