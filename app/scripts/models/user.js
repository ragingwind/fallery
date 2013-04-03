define([
  'app',
  'models/node'
], function ( app, Node) {

  'use strict';

  var User = Node.extend({

    idAttribute: 'id',

    url: function() {
      return this.fbUrl( this.id || 'me', 'fields=id,name,cover,first_name,last_name,link,username' );
    }

  });

  return User;

});
