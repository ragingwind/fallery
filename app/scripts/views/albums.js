define([
  'app',
  'fallery',
  'views/list',
  'backbonetv'
], function( app, fallery, List ) {

  'use strict';

  return Backbone.TV.View.extend({

    id: 'albums',

    initialize: function() {
      this.list = new List({ id:'list', visibleCount: 13, marginCount: 1 });
    },

    keydown: function(responder, event) {
      this.list.traverse(responder, event);
      this.list.$el.find('li').css('opacity', 1);
    },

    keyup: function(responder, event) {
      var hovered = this.list.hovered();
      if ( hovered ) {
        this.timer && clearTimeout(this.timer);
        this.albumId = hovered.attr('data-index');
        var handleTimer = _.bind(function() {
          var currentId = this.list.hovered().attr('data-index');
          if (this.albumId === currentId) {
            this.selectAlbum( currentId );
            this.list.$el.find('li:not(.hover)').transition({ opacity: 0 }, 100 );
          }
        }, this);
        this.timer = setTimeout(handleTimer, 500);
      }
    },

    selectAlbum: function( albumId ) {
      albumId || ( albumId = this.list.hovered().attr('data-index') );
      var album = this.albums.at( albumId, true );
      this.trigger('albums:select', { album: album });
    },

    render: function() {
      this.append(this.list)
    },

    fetch: function( user ) {
      fallery.on( 'albums:change', this.albumsUpdated, this );
      fallery.getAlbums( user );
    },

    albumsUpdated: function( opts ) {
      if ( opts.status === 'done' ) {
        this.albums = opts.data;
        _.extend(this.albums, {
          at: function(index, raw) {
            var model = Backbone.Collection.prototype.at.call(this, index);
            if (raw) {
              return model
            } else {
              var html;
              if ( model ) {
                html = '<div class="item">' + model.get('name') + '</div>';
              }
              return html;
            }
          }
        });
        this.list.items( this.albums );
        this.list.hover( 0 );
        this.list.$el.find('li:not(.hover)').css('opacity', 0);
        this.trigger( 'albums:change' );
      }
    },

    animate: function( done ) {
      done || ( done = function(){} );
      this.$el.transition({ x: -100, opacity: 1 }, 1000, done);
    },

    hide: function() {
      this.$el.css('display', 'none');
    },

    show: function() {
      this.$el.css('display', 'block');
    }

  });

});
