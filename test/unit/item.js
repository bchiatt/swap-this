/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Mongo     = require('mongodb'),
    Item      = require('../../app/models/item'),
    Message   = require('../../app/models/message'),
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

  describe('.create', function(){
    it('should create a new Item object', function(done){
      var ownerId = Mongo.ObjectID('000000000000000000000001'),
      fields  = {name:'car', description:'1990 Toyota Corolla', tags:'car, blue', isAvailable:true},
      files   = {};
      console.log('AAAAAAAA');
      console.log(item);
      console.log('AAAAAAAA');
      Item.create(ownerId, fields, files, function(err, item){
        console.log('>>>>>>>', item);
        expect(item._id).to.be.instanceof(Mongo.ObjectID);
        expect(item.tags).to.have.length(2);
        expect(item.isAvailable).to.be.true;
        console.log('>>>><<<<<', item);
        done();
      });
    });
  });
/*
  describe('.findById', function(){
    it('should find one item by id', function(done){
      Item.findById('b00000000000000000000001', function(err, item){
        expect(item.name).to.equal('car');
        expect(item).to.be.instanceof(Item);
      });
    });
  });

  describe('.find', function(){
    it('should find a specific item', function(done){
      var ownerId = '000000000000000000000001';
      Item.find({name:'car'}, function(err, item){
        console.log(item);
        expect(item.description).to.equal('1990 Toyota Corolla');
        done();
      });
    });
  });

  /*describe('.query', function(){
    it('', function(){

    });
    });*/

 /* describe('#save', function(){
    it('should save an item', function(done){
      Item.findById('b00000000000000000000001', function(err, item){
        item.isAvailable = false;
        item.save(fields, files, function(err, item){
          Item.findById('b000000000000000000000001', function(err, item){
            expect(item.name).to.equal('car');
            expect(item.isAvailable).to.equal(false);
            done();
          });
        });
      });
    });
  });*/




}); //final close

