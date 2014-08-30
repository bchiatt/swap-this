/* global describe, before, beforeEach, it */

'use strict';

process.env.DB   = 'swap-test';

var expect  = require('chai').expect,
    cp      = require('child_process'),
    app     = require('../../app/index'),
    cookie  = null,
    request = require('supertest');

describe('users', function(){
  before(function(done){
    request(app).get('/').end(done);
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [process.env.DB], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      request(app)
      .post('/login')
      .send('email=bob@aol.com')
      .send('password=1234')
      .end(function(err, res){
        cookie = res.headers['set-cookie'][0];
        done();
      });
    });
  });

  describe('get /register', function(){
    it('should show the register page', function(done){
      request(app)
      .get('/register')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Register');
        done();
      });
    });
  });

  describe('post /register', function(){
    it('should register a new user', function(done){
      request(app)
      .post('/register')
      .send('email=larray%40aol.com&password=1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/login');
        done();
      });
    });

    it('should not register a new user', function(done){
      request(app)
      .post('/register')
      .send('email=bob%40aol.com&password=1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/register');
        done();
      });
    });
  });

  describe('get /login', function(){
    it('should show the login page', function(done){
      request(app)
      .get('/login')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Login');
        done();
      });
    });
  });

  describe('post /login', function(){
    it('should login a user', function(done){
      request(app)
      .post('/login')
      .send('email=bob%40aol.com&password=1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/profile');
        done();
      });
    });

    it('should not login a user', function(done){
      request(app)
      .post('/login')
      .send('email=bob%40aol.com&password=4567')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/login');
        done();
      });
    });
  });

  describe('delete /logout', function(){
    it('should log out a user', function(done){
      request(app)
      .delete('/logout')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/');
        done();
      });
    });
  });

  describe('get /profile', function(){
    it('should show the profile page', function(done){
      request(app)
      .get('/profile')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Available');
        expect(res.text).to.include('Photo');
        done();
      });
    });
  });

  describe('get /profile/edit', function(){
    it('should show the edit profile page', function(done){
      request(app)
      .get('/profile/edit')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Edit Profile');
        done();
      });
    });
  });

  describe('post /profile', function(){
    it('should redirect to the profile page', function(done){
      request(app)
      .post('/profile')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/profile');
        done();
      });
    });
  });

  describe('get items/new', function(){
    it('should display the add item page', function(done){
      request(app)
      .get('/items/new')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Add Item');
        expect(res.text).to.include('Tags');
        expect(res.text).to.include('Not for Sale');
        done();
      });
    });
  });
});

