'use strict';

var crypto = require( 'crypto' );
var settings = require( 'settings' );
var express = require( 'express' );
var app = express();
var ini = require( 'ini' );
var fs = require('fs');
var _ = require( 'underscore' );
var env = process.env.NODE_ENV ? 'production' : 'development';

function key() {
  var data = Math.random().toString();
  return crypto.createHash( 'md5' ).update( data ).digest( 'hex' );
}

// read configuration from .env and config.js
console.log('exist check');
console.log(fs.existsSync('./.env'));
if (fs.existsSync('./.env')) {
  console.log( fs.readFileSync('./.env', 'utf-8') );
  _.defaults( process.env, ini.parse(fs.readFileSync('./.env', 'utf-8')) );
}

app.config = new settings( require('./config'), {env: env} );

// create session with memory store
app.store = new express.session.MemoryStore;

// set default configurations.
app.configure(function() {
  app.use( express.bodyParser() );
  app.use( express.cookieParser() );
  app.use( express.session({
    secret: 'fallery secret',
    store: app.store,
    key : 'sid'
  }));
  app.use( express.methodOverride() );
  app.use( function(req, res, next){
    console.log('%s %s', req.method, req.url);
    next();
  });
  app.use( app.router );
});

// load routers
require( './routers/dashboard' )( app );
require( './routers/fallery' )( app );

module.exports = app;
