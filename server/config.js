'use strict';

var os = require( 'os' );

module.exports = {
  common: {
    port: 3501,
    oauth: {
      clientId: process.env.FACEBOOK_CLIENTID,
      clientSecret: process.env.FACEBOOK_SECRET
    }
  },

  development: {
    host: 'http://192.168.0.5',
  },

  production:  {
    host: 'http://fallery.herokuapp.com',
    port: process.env.PORT
  }
};
