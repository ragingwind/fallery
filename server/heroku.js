var app = require( './index' );
var express = require( 'express' );
var basepath;

app.configure( 'development', function() {
  basepath = __dirname.replace( 'server', 'app' );
  app.use( express.errorHandler({ dumpExceptions: true, showStack: true }) );
});

app.configure( 'production', function() {
  basepath = __dirname.replace( 'server', 'app' );
  app.use( express.errorHandler({ dumpExceptions: true, showStack: true }) );
});

app.use( '/', express.favicon(basepath + '/favicon.ico') );
app.use( '/', express.static(basepath) );

app.listen(app.config.port, function() {
  console.log( "server listening on port %s:%d", app.config.host, app.config.port);
});
