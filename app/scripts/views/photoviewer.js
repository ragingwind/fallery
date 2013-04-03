define([
  'app',
  'fallery'
], function( app, fallery ) {

  'use strict';

  return Backbone.TV.View.extend({

    id: 'photoviewer',

    R: {
      template: 'template://photoviewer.html'
    },

    initialize: function() {
      this.on( 'keydown:enter', this.hide );
      _.bindAll( this );
    },

    hide: function() {
      this.container.children( 'img' ).remove();
      this.container.css( 'opacity', 0 );
      this.$el.css( 'opacity', 0 );
      this.superview.focusin();
    },

    show: function() {
      this.$el.css('opacity', 1);
    },

    photo: function( photo ) {
      this.show();
      var imageDeferred = R.load( 'image://' + photo.source, this );
      imageDeferred.done(function( img ) {
        var min = _.min([this.$el.width(), this.$el.height()]);
        $(img).height(min < photo.height ? min : photo.height);
        this.container.append(img);
        this.container.transition({ opacity: 1 }, 500, 'linear');
      });
    },

    render: function() {
      this.$el.append(R.get(this.R.template)());
      this.container = this.$el.find('.image-container')
    }

  });

});
