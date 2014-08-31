/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    //Mongo     = require('mongodb'),
    Item      = require('../../app/models/item'),
    //Message   = require('../../app/models/message'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    db        = 'swap-test';

describe('Item', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new Item object', function(){
      var i = new Item('000000000000000000000007',{name:['car'], description:['1990 Toyota Corolla'], isAvailable: ['true'], tags:['car, blue']});
      expect (i).to.be.instanceof(Item);
    });
  });

 /* describe('.create', function(){
    it('should create a new Item object', function(done){
      var i = '000000000000000000000001',
          fields  = {name:['car'], description:['1990 Toyota Corolla'], isAvailable:['true'], tags:['car, blue']},
          files   = {photo: [{path:''}]};

      var i =  Item.create(ownerId, fields, files, function(){
        Item.findById(i._id, function(err, item){
          console.log('>>>III<<<', i);
          expect(item._id).to.be.instanceof(Mongo.ObjectID);
          expect(item.tags).to.have.length(2);
          expect(item.isAvailable).to.be.true;
          done();
        });
      });
    });
  });*/

  describe('.findById', function(){
    it('should find one item by id', function(done){
      Item.findById('b00000000000000000000001', function(err, item){
        expect(item.name).to.equal('car');
        expect(item).to.be.instanceof(Item);
        done();
      });
    });
  });

 /* describe('#save', function(){
    it ('should save the item to the database', function(done){
      var i = new Item('000000000000000000000007',{name:['car'], description:['1990 Toyota Corolla'], isAvailable: ['true'], tags:['car, blue']});
      i.save(function(){
        expect(i._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });*/

  /*describe('.find', function(){
    it('should find a specific item', function(done){
      Item.find({name:'car'}, function(err, item){
        console.log('ITEM*****', item);
        expect(item.description).to.equal('1990 Toyota Corolla');
        done();
      });
    });
  });*/

 /* describe('#save', function(){
    it('should save an item', function(done){
      var ownerId = '000000000000000000000001',
          fields  = {name:'car', description:'1990 Toyota Corolla', tags:'0'},
          files   = {};
      item.save(fields, files, function(err, item){
        User.findById('b00000000000000000000001', function(err, item){
          expect(item.name).to.equal('car');
          done();
        });
      });
    });
  });*/
}); //final close

