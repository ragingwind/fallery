define([
  'app',
  'lodash',
  'backbone'
], function ( app, _, Backbone) {

  'use strict';

  var Node = Backbone.Model.extend({

    idAttribute: 'id',

    index: function() {
      return this.collection.indexOf( this );
    },

    next: function() {
      return this.collection.at( this.index() + 1 );
    },

    prev: function() {
      return this.collection.at( this.index() - 1 );
    },

    cache: function( id ) {
      id || ( id = this.id );
      localStorage.setItem( id, JSON.stringify( this.attributes ) );
    },

    fbUrl: function( node, params ) {
      node || ( node = 'me');
      params = params ? params + '&' : '';
      return 'https://graph.facebook.com/' + node +
             '?' + params +
             'access_token=' + $.cookie('access_token');
    },

    load: function( id ) {
      var data = JSON.parse( localStorage.getItem( id ) );
      if ( data ) {
        this.set( data );
        return this;
      }
      return undefined;
    },

    clearCache: function( id ) {
      id || ( id = this.id );
      localStorage.removeItem( id );
    }

  });

  return Node;

});
