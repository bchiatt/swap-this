'use strict';

var Mongo  = require('mongodb'),
    _      = require('lodash'),
    fs     = require('fs'),
    path  = require('path');


function Item(ownerId, o){
  this._id          = Mongo.ObjectID();
  this.name         = o.name[0];
  this.description  = o.description[0];
  this.isAvailable  = o.isAvailable[0];
  this.ownerId      = ownerId;
  this.tags         = o.tags[0].trim().split(',').map(function(i){return i.trim();});
  this.photos       = [];
}

Object.defineProperty(Item, 'collection', {
  get: function(){return global.mongodb.collection('items');}
});

Item.create = function(ownerId, fields, files, cb){
  console.log('fields in ITEM.CREATE>>>>>>>>>>>>>>>', fields);
  console.log('files in ITEM.CREATE>>>>>>>>>>>>>>>', files);
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

Item.prototype.save = function(fields, files, cb){
  var properties = Object.keys(fields),
      self       = this;
  properties.forEach(function(property){
    self[property] = fields[property][0];
  });
  var oldphotos = this.photos,
      newphotos = moveFiles(files.photos, oldphotos.length, '/img/' + this._id);
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
