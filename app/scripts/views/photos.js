define([
  'app',
  'fallery',
  'views/slider',
  'backbonetv'
], function( app, fallery, Slider ) {

  'use strict';

  return Backbone.TV.View.extend({

    id: 'photos',

    R: {
      photo: 'template://photo.html'
    },

    maxVisibleCount: 6,

    photoIndex: 0,

    initialize: function() {
      fallery.on( 'photos:change', this.photosUpdated, this );

      this.slider = new Slider({ className: 'slider' });
      this.slider.on('sliderview:moveto', function(delegate) { delegate.call(); });
      this.slider.on('sliderview:addto', function(delegate) {
        var photoModel = delegate.model.get('photoModel');
        var imageDeferred = R.load( 'image://' + photoModel.get('images')[4].source, this );
        imageDeferred.done(function() {
          photoModel.set( 'thumb', photoModel.get('images')[4] );
          photoModel.set( 'time', new Date(photoModel.get('created_time')).toLocaleDateString());
          delegate.model.set({ contents: this.photoTemplate(photoModel.attributes) });
        });
        delegate.call();
      }, this);
      this.slider.on('sliderview:remove', function(delegate) { delegate.call(); }, this);
      this.append(this.slider);
    },

    hide: function() {
      this.$el.hide();
    },

    show: function() {
      this.$el.show();
    },

    slideLeft: function(view, keyevent) {
      if (this.slider.length() > 1) {
        this.slider.slideLeft().shift();
      }

      if (this.slider.length() < this.maxVisibleCount) {
        this.fillup();
      }
    },

    slideRight: function(view, keyevent) {
      if (this.slider.front().index > 0) {
        this.slider.unshift().slideRight();
      }

      if (this.slider.length() > this.maxVisibleCount) {
        this.slider.pop();
        this.photoIndex > 0 && this.photoIndex--;
      }
    },

    fillup: function() {
      var model = this.photos.at(this.photoIndex);
      if (model) {
        model.set('thumb', { source:'images/default-photo.png' });
        this.datasource.add({
          contents: this.photoTemplate(model.attributes),
          photoModel: model
        }, { merge: true });

        this.photoIndex++;
      }
    },

    focusedPhoto: function() {
      return this.$el.is(":visible") ? this.slider.front() : undefined;
    },

    fetch: function( album ) {
      // reset config values.
      delete this.photos;
      this.datasource = this.slider.reset();
      this.photoIndex = 0;
      // request new photos of the album.
      this.photos = fallery.getPhotos( album );
    },

    photosUpdated: function( opts ) {
      if ( opts.status === 'done' ) {
        this.photos = opts.data;
        _.times(this.maxVisibleCount, this.fillup, this);
        this.trigger('photos:change');
      }
    },

    render: function() {
      this.photoTemplate = R.get( this.R.photo );
    }

  });

});
