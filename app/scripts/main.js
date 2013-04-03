"use strict";

require.config({

  paths: {
    jquery: '../components/jquery/jquery',
    lodash: '../components/lodash/lodash',
    backbone: '../components/backbone/backbone',
    backbonetv: '../components/backbone.tv/backbone.tv',
    backbonetv_widget: '../components/backbone.tv/backbone.tv.widget',
    'jquery-cookie': '../components/jquery.cookie/jquery.cookie',
    'jquery.transit.min': 'vendor/jquery.transit.min',
    tests: '../tests/tests'
  },

  shim: {
    // jQuery plugins library depends
    'jquery-cookie': { deps: ['jquery'] },
    'jquery.transit.min': { deps: ['jquery'] },

    // Backbone library depends on lodash and jQuery.
    backbone: {
      deps: [ 'lodash', 'jquery' ],
      exports: 'Backbone'
    },

    // Backbone.TV depends on Backbone.
    backbonetv: [ 'backbone', '../scripts/vendor/web-animation' ],
    backbonetv_widget: [ 'backbonetv' ]
  }

});

require([
  'app',
  'router'
], function( app, Router ) {

  // Define your master router on the application namespace and trigger all
  // navigation from this instance.
  app.router = new Router();

  // start backbone history
  Backbone.history.start({ pushState: false });

  // All navigation that is relative should be passed through the navigate
  // method, to be processed by the router. If the link has a `data-bypass`
  // attribute, bypass the delegation completely.
  $(document).on('click', 'a:not([data-bypass])', function(evt) {
    // Get the absolute anchor href.
    var href = $(this).attr('href');

    // If the href exists and is a hash route, run it through Backbone.
    if (href && href.indexOf('#') === 0) {
      // Stop the default event to ensure the link will not cause a page
      // refresh.
      evt.preventDefault();

      // `Backbone.history.navigate` is sufficient for all Routers and will
      // trigger the correct events. The Router's internal `navigate` method
      // calls this anyways.  The fragment is sliced from the root.
      Backbone.history.navigate(href, true);
    }
  });

});
