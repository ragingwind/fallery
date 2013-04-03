define([
  'backbonetv',
  'jquery.transit.min',
  'jquery-cookie'
], function() {
  // Provide a global location to place configuration settings and module
  // creation.
  var app = {
    // The root path to run the application.
    root: '/',

    // main window for application
    window: new Backbone.TV.Screen().render()
  };

  var paths = {
    template: '/templates/',
    image: '/images/',
    html: '',
    xhrWebWorker: '../components/backbone.tv/backbone.tv.xhr-worker.js'
  };

  // configuration for backbone.tv
  Backbone.TV.configure({
    // set xhr-worder path
    xhrWebWorker: paths['xhrWebWorker'],

    // can be used to supply manipulation of path.
    path: function( type, path ) {
      var pathname = paths[ type ];
      if ( !/http:|https:/.test(path) ) {
        path = pathname + path;
      }
      return path;
    }
  });

  // override backbone sync for supporting xhr-webworker
  Backbone.sync = function(method, model, options) {
    var params = _.clone( options );
    params.deferred = $.Deferred();
    params.deferred.timestamp = new Date().getTime();
    params.type = 'GET',
    params.contentType = 'json',
    params.path = _.isFunction(model.url) ? model.url() : model.url;

    var success = options.success;
    params.success = function(resp) {
      if (success) success(model, resp, params);
      model.trigger('sync', model, resp, params);
    };

    var error = options.error;
    params.error = function(xhr) {
      if (error) error(model, xhr, params);
      model.trigger('error', model, xhr, params);
    };

    Backbone.TV.request( params, function( opts, contents, status ) {
      var resp = JSON.parse(contents);
      status === 'success' ? opts.success( resp ) : opts.error( resp );
    });

    return params.deferred;
  };

  // extending the app.
  return _.extend(app, {
    rootView: function (view) {
      view && app.window.rootView( view );
      return app.window.rootView();
    }

  }, Backbone.Events);

});
