define([
  'app',
  'fallery',
  'views/keyguide',
  'backbonetv'
], function( app, fallery, Keyguide ) {

  'use strict';

  return Backbone.TV.View.extend({

    id: 'background',

    initialize: function() {
      this.on( 'render:after', this.afterRender, this );
    },

    render: function() {
      this.logo = this.append( new Backbone.TV.View({ id: 'logo'} ));
    },

    cover: function(cover) {
      cover || (cover = 'background-defaut.png');
      R.load( 'image://' + cover.source, this ).done(function(cover) {
        this.$cover = $(cover).appendTo(this.$el);
        this.trigger('cover:change');
      });
    },

    animate: function(done) {
      done || ( done = function(){} );

      if (0) {
        this.$cover.transition({ opacity: 0.6 }, 2000, 'linear', done);
        this.logo.$el.transition({ opacity:0.0, delay: 1000 }, 1000, 'linear');
      } else {
        this.$cover.transition({ opacity: 0.6 }, 10, 'linear', done);
        var logo = this.logo;
        this.logo.$el.transition({ opacity:0.0 }, 10, 'linear', function() {
          logo.$el.addClass( 'banner' );
          logo.$el.css( 'opacity', 1 );
        });
      }
    }

  });

});
