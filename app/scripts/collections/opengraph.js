define([
  'backbone'
], function ( Backbone ) {

  'use strict';

  var OpenGraph = Backbone.Collection.extend({

    modelType: '',

    fields: '',

    initialize: function( opts ) {
      opts || ( opts = {} );
      _.extend( this, opts );
    },

    parse: function( res, opts ) {
      var type = _.result( this, 'modelType' );
      var models = res[type] ? res[type] : res;
      this.paging = models.paging ? models.paging : {};
      this._ismore( opts );
      return models.data;
    },

    update: function( models, opts ) {
      Backbone.Collection.prototype.update.call( this, models, opts );
      this.trigger( 'added', this, this._ismore( opts ));
    },

    _ismore: function( opts ) {
      opts.more = this.paging.next !== undefined;
      return opts;
    },

    more: function() {
      this.fetch({ more: true, update: true, remove: false });
    },

    fbUrl: function( node, params ) {
      node || ( node = 'me');
      params = params ? params + '&' : '';
      return 'https://graph.facebook.com/' + node +
             '?' + params +
             'access_token=' + $.cookie('access_token');
    },

    fetch: function( opts ) {
      opts || ( opts = {} );
      this.url = undefined;
      if ( opts.more ) {
        this.url = this.paging.next;
      } else {
        var node = _.result( this, 'node' );
        this.url = this.fbUrl( node || this.id, this.fields );
      }

      this.fetchDeferred = Backbone.Collection.prototype.fetch.call( this, opts );
      return this.fetchDeferred;
    },

    setObject: function( key, object ) {
      localStorage.setItem( key, JSON.stringify( object ));
    },

    loadObject: function( key ) {
      return JSON.parse( localStorage.getItem( key ) );
    },

    cache: function() {
      this.modelType || ( this.modelType = this.id );
      var manifest = {};

      // create index table
      _.each( this.models, function( model ) {
        manifest[ model.id ] = model.id;
      });

      localStorage.setItem( this.modelType, JSON.stringify( manifest ));
      // save model each model.
      _.each( manifest, function( index ) {
        this.get( index ).cache();
      }, this);
    },

    // load model from local storage.
    load: function() {
      this.modelType || ( this.modelType = this.id );
      var models = [];
      var manifest = JSON.parse( localStorage.getItem( this.modelType ) );

      if ( manifest ) {
        _.each( manifest, function( index ) {
          models.push( JSON.parse( localStorage.getItem( index ) ) );
        }, this);
        this.reset( models );
        return this;
      } else {
        return undefined;
      }
    }

  });


  return OpenGraph;

});
