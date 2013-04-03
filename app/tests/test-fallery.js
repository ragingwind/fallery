define([
  'app',
  'collections/friends',
  'collections/albums',
  'collections/photos',
  'models/user',
  'backbonetv',
], function( app, Friends, Albums, Photos, User ) {

  'use strict';

  var TestConsole = Backbone.TV.View.extend({

    id: 'test',

    R: {
      template: 'template://test.html',
      albumTemplate: 'html://<li class="album" data-album-id="<%= id %>">' +
                     '<div class="album-name"><%= name %></div> ' +
                     '</li>',
      userTemplate: 'html://<li class="user" data-user-id="<%= id %>">' +
                    '<img class="user-picture" src="https://graph.facebook.com/<%= id %>/picture" />' +
                    '</li>',
      photoTemplate: 'html://<li class="photo" data-photo-id="<%= id %>">' +
                     '<% var last = _.last(images) %>' +
                     '<img class="photo" src="<%= last.source %>" />' +
                     '</li>'
    },

    me: undefined,

    selectedUser: undefined,

    initialize: function() {
      this.on( 'render:after', this.afterRender, this );
      this.me = new User();
      this.me.bind( 'change', function() {
        this.getFriends( this.me );
      }, this );

      _.bindAll( this, 'userSelected', 'albumSelected' );
    },

    render: function() {
      this.$el.append( R.get( this.R.template )() );
    },

    afterRender: function() {
      this.me.fetch();
    },

    getFriends: function( user ) {
      this.friends && ( delete this.friends );
      this.friends = new Friends({ user: user, id: user.id });
      this.friends.bind( 'reset', this.friendsUpdated, this);
      this.friends.bind( 'added', this.friendsUpdated, this);
      this.friends.fetch();
    },

    friendsUpdated: function( collection, opts ) {
      if ( opts.more ) {
        collection.more();
      } else {
        this.friends.cache();
        var $users = this.$el.find( '#users ul' );
        $users.append( R.get( this.R.userTemplate )( this.me.attributes ) );
        this.friends.each( function( friend ) {
          $users.append( R.get( this.R.userTemplate )( friend.attributes ) );
        }, this);
        this.$el.find( '#users ul li' ).click( this.userSelected );

        this.selectedUser = this.me;
        this.getAlbums();
      }
    },

    getAlbums: function() {
      var user = this.selectedUser;
      user.albums = new Albums({ user: user, id: user.id });
      user.albums.bind( 'reset', this.albumsUpdated, this );
      user.albums.bind( 'added', this.albumsUpdated, this );
      user.albums.fetch();
    },

    albumsUpdated: function( collection, opts ) {
      if ( opts.more ) {
        collection.more();
      } else {
        var $albums = this.$el.find( '#albums ul' );
        $albums.children().remove();
        collection.each( function( album ) {
          $albums.append( R.get( this.R.albumTemplate )( album.attributes ) );
        }, this);
        this.$el.find( '#albums ul li' ).click( this.albumSelected );
      }
    },

    userSelected: function( e ) {
      var uid = $( e.currentTarget ).attr( 'data-user-id');
      var user = uid === this.me.get( 'id' ) ? this.me : this.friends.get( uid );
      this.selectedUser = user;
      this.getAlbums();
    },

    getPhotos: function( album ) {
      this.currentPhotos = new Photos({ album: album });
      this.currentPhotos.bind( 'reset', this.photosUpdated, this );
      this.currentPhotos.bind( 'added', this.photosUpdated, this );
      this.currentPhotos.fetch();
    },

    photosUpdated: function( collection, opts ) {
      if ( opts.more ) {
        collection.more();
      } else {
        var $photos = this.$el.find( '#photos ul' );
        $photos.children().remove();
        collection.each( function( photo ) {
          $photos.append( R.get( this.R.photoTemplate )( photo.attributes ) );
        }, this);

        // @TODO click event to show big photo.
      }
    },

    albumSelected: function( e ) {
      var aid = $( e.currentTarget ).attr( 'data-album-id');
      var album = this.selectedUser.albums.get( aid );
      this.getPhotos( album );
    }

  });

  return TestConsole;

});
