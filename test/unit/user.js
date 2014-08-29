/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    User      = require('../../app/models/user'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    db        = 'swap-test';

describe('User', function(){
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
    it('should create a new User object', function(){
      var u = new User();
      expect(u).to.be.instanceof(User);
    });
  });

  describe('.findOne', function(){
    it('should find a specific user', function(done){
      User.findOne({email:'bob@aol.com'}, function(err, user){
        expect(user.email).to.equal('bob@aol.com');
        done();
      });
    });
  });


  describe('.register', function(){
    it('should register a user', function(done){
      var user = {email:'larry@gmail.com', password:'1234'};
      User.register(user, function(err, user){
        expect(user.email).to.equal('larry@gmail.com');
        done();
      });
    });
    it('should not register a user', function(done){
      var user = {email:'bob@aol.com', password:'1234'};
      User.register(user, function(err, user){
        expect(user).to.not.be.ok;
        done();
      });
    });
  });

  describe('#save', function(){
    it('should save a user', function(done){
      var body = {phone:'111-2222'};
      User.findById('000000000000000000000001', function(err, user){
        user.save(body, function(err, user, c){
          User.findById('000000000000000000000001', function(err, user){
            console.log('USER', user);
            console.log('>>>>>>>', c);
            expect(user.phone).to.equal('111-2222');
            done();
          });
        });
      });
    });
  });
}); //final close

