define([
  'app',
  'fallery',
  'views/background',
  'views/albums',
  'views/profile',
  'views/photos',
  'views/keyguide',
  'views/photoviewer',
  'backbonetv'
], function(
  app, fallery, Background, Albums, Profile, Photos, KeyGuide, PhotoViewer ) {

  'use strict';

  return Backbone.TV.View.extend({

    id: 'root',

    signin: false,

    initialize: function() {
      this.background = new Background();
      this.albums = new Albums();
      this.profile = new Profile();
      this.photos = new Photos();
      this.photoviewer = new PhotoViewer();

      this.listenTo( this, 'app:start', this.appStarted );
      this.listenTo( fallery, 'error', this.onError );
      this.listenTo( fallery, 'me:change', this.meChanged );
      this.listenTo( this.background, 'cover:change', this.coverChanged );
      this.listenTo( this.albums, 'albums:change', this.albumsChanged );
      this.listenTo( this.albums, 'albums:select', this.albumSelected );
      this.listenTo( this.profile, 'users:change', this.usersChanged );
      this.listenTo( this.profile, 'user:signin', this.userSelectedSignIn );
      this.listenTo( this.profile, 'user:signout', this.userSelectedSignOut );
      this.listenTo( this.photos, 'photos:change', this.photoChanged );

      this.listenTo( this, 'hkeydown:option', function() {
        this.profile.focusout();
        if ( fallery.meHasAuthorized() ) {
          if ( this.profile.isSlided() ) {
            this.albums.hide();
            this.photos.hide();
          }
          this.profile.slide(this.profileSlided);
        }
      }, this);

      this.on('keydown:enter', function(responder, event) {
        var photo = this.photos.focusedPhoto();
        if ( photo ) {
          var photoModel = photo.model.get( 'photoModel' );
          this.photoviewer.photo( photoModel.get('images')[0] );
          this.photoviewer.focusin();
        }
      }, this);

      this.on('keydown:up keydown:down', function(responder, event) {
        this.photos.hide();
        this.albums.keydown( responder, event );
      }, this);

      this.on('keyup:up keyup:down', function(responder, event) {
        this.albums.keyup( responder, event );
      }, this);

      this.on('keydown:left', function(responder, event) {
        this.photos.slideLeft();
      }, this);

      this.on('keydown:right', function(responder, event) {
        this.photos.slideRight();
      }, this);

      _.bindAll(this);
    },

    onError: function() {
      console.error('error');
    },

    appStarted: function() {
      this.profile.focusin();
    },

    userSelectedSignIn: function() {
      fallery.signin();
    },

    userSelectedSignOut: function() {
      fallery.signout();
    },

    profileSlided: function( hide ) {
      if ( hide ) {
        this.albums.show();
        this.photos.show();
        this.focusin();
      } else {
        this.profile.focusin();
      }
    },

    photoChanged: function() {
      if ( this.profile.isSlided() ) {
        this.photos.show();
        this.focusin();
      }
    },

    changeAlbums: function( user ) {
      user || ( user = fallery.me );
      this.albums.fetch( user );
    },

    coverChanged: function() {
      this.background.animate( this.changeAlbums );
    },

    albumsChanged: function() {
      this.albums.animate( _.bind(function() {this.albums.selectAlbum();}, this) );
    },

    albumSelected: function( opts ) {
      this.photos.fetch( opts.album );
    },

    coverChange: function() {
      this.background.cover( fallery.me.get('cover') );
    },

    usersChanged: function() {
      this.profile.slide(this.coverChange);
    },

    meChanged: function() {
      this.profile.profile( fallery.me );
    },

    render: function() {
      this.$el.css('width', $(window).width())
              .css('height', $(window).height());
      this.append( this.background );
      this.append( this.profile );
      this.append( this.albums );
      this.append( this.photos );
      this.append( new KeyGuide() );
      this.append( this.photoviewer );
    }

  });

});
