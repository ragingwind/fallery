'use strict';

var netutil = require( '../libs/netutil' );
var OAuth2 = require( 'oauth' ).OAuth2;
var qs = require( 'querystring' );
var url = require( 'url' );
var https = require( 'https' );

module.exports = function(app) {

  var oauthconf = {
    clientId: app.config.oauth.clientId,
    clientSecret: app.config.oauth.clientSecret,
    authorizePath: 'https://www.facebook.com/dialog/oauth',
    accessTokenPath: 'https://graph.facebook.com/oauth/access_token',
    params: {
      redirect_uri: app.config.host + (process.env.NODE_ENV !== 'production' ? ':' + app.config.port : '') + '/facebook/redirect',
      scope: [
          'offline_access',
          'user_about_me',
          'user_birthday',
          'user_photos',
          'user_videos',
          'read_stream',
          'read_friendlists',
          'friends_about_me',
          'friends_photos',
          'friends_videos',
      ].join(',')
    }
  };

  app.oauth = new OAuth2(oauthconf.clientId, oauthconf.clientSecret,
                    '', oauthconf.authorizePath, oauthconf.accessTokenPath);

  app.get('/facebook/oauth', function(req, res) {
    var opts = {
      login_url: app.oauth.getAuthorizeUrl( oauthconf.params ),
      authorized: req.cookies.access_token !== '',
      access_token: req.cookies.access_token
    };

    res.send( opts );
  }),

  app.get('/facebook/redirect', function(req, res) {
    var query = url.parse( req.url ).query;
    var code = qs.parse( query ).code;
    var state = qs.parse( query ).state;

    app.oauth.getOAuthAccessToken(code, oauthconf.params,
      function(error, data, response) {
        req.method = 'get';
        res.cookie( 'access_token', data );
        res.redirect('/#authorized');
    });
  });

};
