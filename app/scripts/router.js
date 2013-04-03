define([
  'app',
  'fallery',
  'views/root',
  'tests'
], function ( app, fallery, RootView, Tests ) {

  'use strict';

  var Router = Backbone.Router.extend({
    routes: {
      'error': 'error',
      'authorized': 'authorized',
      'test/:which': 'test',
      '': 'index'
    },

    initialize: function() {
      app.rootView( new RootView() );
    },

    index: function() {
      app.rootView().trigger( 'app:start' );
    },

    authorized: function() {
      fallery.signin();
    },

    test: function( which ) {
      app.rootView( new Tests[which]() );
    }

  });

  return Router;

});
