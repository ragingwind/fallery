define([
  'app',
  'models/user',
  'collections/friends',
  'collections/albums',
  'collections/photos',
  'backbone'
], function( app, User, Friends, Albums, Photos ) {

  var fallery = {
    // current activated user.
    me: undefined,

    // friends of current activated user ( me )
    friends: undefined,

    // last photos that user requested.
    photos: undefined
  };


  _.extend(fallery, {
    error: function(res) {
      fallery.trigger('error', { reason: JSON.parse(res.responseText) });
    },

    get: function( url, done ) {
      return $.ajax({ type: 'GET', dataType: 'json', url: url })
              .fail(this.error)
    },

    clearToken: function() {
      $.cookie('access_token', '');
    },

    meHasAuthorized: function() {
      return $.cookie('access_token') !== '' || this.me.get( 'id' ) !== undefined;
    },

    meChanged: function() {
      this.trigger('me:change');
    },

    authorized: function(res) {
      if ( res.authorized ) {
        this.me.bind('change', this.meChanged);
        this.me.fetch();
      } else {
        window.location = res.login_url;
      }
    },

    // try to get access token and me information. if user had authorized,
    // set access_token and load info. it's not redirect to facebook login page.
    signin: function() {
      if ( !fallery.me.load('me') ) {
        this.get('/facebook/oauth').done(this.authorized);
      } else {
        this.meChanged();
      }
    },

    signout: function() {
      fallery.me.clearCache( 'me' );
      fallery.clearToken();
      window.location = '/';
    },

    prepare: function() {
      if ( !this.meHasAuthorized() ) {
        this.trigger( 'error', 'Me has not authorized.' );
        return;
      }
    },

    getFriends: function( user ) {
      this.friends && ( delete this.friends );
      this.friends = new Friends({ user: user, id: user.id });
      if ( !this.friends.load() ) {
        this.friends.bind( 'reset', this.friendsUpdated, this);
        this.friends.bind( 'added', this.friendsUpdated, this);
        this.friends.fetch();
      } else {
        this.trigger( 'friends:change', { status: 'done', source: 'local',
          data: this.friends });
      }
    },

    friendsUpdated: function( collection, opts ) {
      if ( opts.more ) {
        collection.more();
        this.trigger( 'friends:change', { status: 'more', data: this.friends });
      } else {
        this.friends.cache();
        this.trigger( 'friends:change', { status: 'done', data: this.friends });
      }
    },

    getAlbums: function( user ) {
      user.albums = new Albums({ user: user, id: user.id });
      if ( !user.albums.load() ) {
        user.albums.bind( 'reset', this.albumsUpdated, this );
        user.albums.bind( 'added', this.albumsUpdated, this );
        user.albums.fetch();
      } else {
        this.trigger( 'albums:change', { status: 'done', source: 'local',
          data: user.albums });
      }
    },

    albumsUpdated: function( collection, opts ) {
      if ( opts.more ) {
        collection.more();
        this.trigger( 'albums:change', { status: 'more', data: collection });
      } else {
        collection.cache();
        this.trigger( 'albums:change', { status: 'done', data: collection });
      }
    },

    getPhotos: function( album ) {
      var photos = this.photos = new Photos({ album: album });
      photos.bind( 'reset', this.photosUpdated, this );
      photos.bind( 'added', this.photosUpdated, this );
      photos.fetch();
      return photos;
    },

    photosUpdated: function( collection, opts ) {
      if ( this.photos ) {
        if ( this.photos.fetchDeferred.timestamp > collection.fetchDeferred.timestamp) {
          console.log('collection has been rejected');
          return;
        }
      }

      if ( opts.more ) {
        collection.more();
        this.trigger( 'photos:change', { status: 'more', data: collection });
      } else {
        collection.cache();
        this.trigger( 'photos:change', { status: 'done', data: collection });
      }
    }

  }, Backbone.Events);

  fallery.me = new User();

  return _.bindAll(fallery);

});
