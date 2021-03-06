'use strict';

var morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    methodOverride = require('express-method-override'),
    less           = require('less-middleware'),
    session        = require('express-session'),
    RedisStore     = require('connect-redis')(session),
    security       = require('../lib/security'),
    debug          = require('../lib/debug'),
    home           = require('../controllers/home'),
    items          = require('../controllers/items'),
    users          = require('../controllers/users');

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(less(__dirname + '/../static'));
  app.use(express.static(__dirname + '/../static'));
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(methodOverride());
  app.use(session({store:new RedisStore(), secret:'my super secret key', resave:true, saveUninitialized:true, cookie:{maxAge:null}}));

  app.use(security.authenticate);
  app.use(debug.info);

  app.get('/', home.index);
  app.get('/register', users.new);
  app.post('/register', users.create);
  app.get('/login', users.login);
  app.post('/login', users.authenticate);

  app.use(security.bounce);
  app.delete('/logout', users.logout);
  app.get('/profile', users.home);
  app.get('/profile/edit', users.edit);
  app.post('/profile', users.update);
  app.get('/items', items.index);
  app.get('/items/new', items.new);
  app.post('/items', items.create);
  app.get('/items/:itemId', items.show);
  app.get('/items/:itemId/bid', items.newBid);
  app.post('/items/:itemId/bid', items.bid);
  app.get('/items/:itemId/edit', items.edit);
  app.post('/items/:itemId/edit', items.update);
  app.get('/offers', items.offers);
  app.post('/offers/:itemId/accept/:bidId/', items.accept);
  app.post('/offers/:itemId/reject/:bidId/', items.reject);
  app.get('/users/:email', users.client);
  app.post('/messages/:userId', users.send);
  app.get('/messages/:msgId', users.message);
  app.get('/messages', users.messages);

  console.log('Express: Routes Loaded');
};

