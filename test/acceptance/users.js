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

  /*describe('post /profile', function(){
    it('should redirect to the profile page', function(done){
      request(app)
      .post('/profile')
      .send('email=bob%40aol.com')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/profile');
        done();
      });
    });
  });*/

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

  /*describe('post /items', function(){
    it('should', function(done){
      request(app)
      .post('/items')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/profile');
        done();
      });
    });
  });*/

  describe('get /items', function(){
    it('should show the items index page', function(done){
      request(app)
      .get('/items')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Photo');
        expect(res.text).to.include('Name');
        done();
      });
    });
  });

  describe('get /items/:itemId', function(){
    it('should show the items show page', function(done){
      request(app)
      .get('/items/b00000000000000000000001')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('car');
        done();
      });
    });
  });

  describe('get /users/:email', function(){
    it('should go to the users show page', function(done){
      request(app)
      .get('/users/nodetest@outlook.com')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('nodetest@outlook.com');
        done();
      });
    });
  });
//STARTED HERE
  describe('post /messages/:userId', function(){
    it('should redirect to the users show page', function(done){
      request(app)
      .post('/messages/000000000000000000000003')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.include('/users/nodetest@outlook.com');
        done();
      });
    });
  });

  describe('get /messages/:msgId', function(){
    it('should go to the users message page', function(done){
      request(app)
      .get('/messages/a00000000000000000000001')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Testing this out.');
        done();
      });
    });
  });

  describe('get /messages', function(){
    it('should go to the users messages page', function(done){
      request(app)
      .get('/messages')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Subject');
        done();
      });
    });
  });

  //x2
  describe('get /items/:itemId/bid', function(){
    it('should go to the item bid page', function(done){
      request(app)
      .get('/items/b00000000000000000000001/bid')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('car');
        done();
      });
    });
  });

  describe('get /items/:itemId/edit', function(){
    it('should take you to the edit items page ', function(done){
      request(app)
      .get('/items/b00000000000000000000001/edit')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('edit');
        done();
      });
    });
  });

  /*describe('post /items/:itemId/edit', function(){
    it('should ', function(done){
      request(app)
      .post('/items/b00000000000000000000001/edit')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.include('/profile');
        done();
      });
    });
  });*/

  /*describe('post /items/:itemId/bid', function(){
    it('should redirect to the item show page', function(done){
      request(app)
      .post('/items/b00000000000000000000001/bid')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.include('/items/b00000000000000000000001');
        done();
      });
    });
  });*/

  describe('get /offers', function(){
    it('should go to the offers page', function(done){
      request(app)
      .get('/offers')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Response');
        done();
      });
    });
  });

  describe('post /offers/:itemId/accept/:bidId/', function(){
    it('should redirect to the offers page', function(done){
      request(app)
      .post('/offers/b00000000000000000000001/accept/b00000000000000000000002')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.include('/offers');
        done();
      });
    });
  });

  describe('post /offers/:itemId/reject/:bidId/', function(){
    it('should redirect to the offers page', function(done){
      request(app)
      .post('/offers/b00000000000000000000001/reject/b00000000000000000000002')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.include('/offers');
        done();
      });
    });
  });

});

