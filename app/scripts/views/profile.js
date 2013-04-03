define([
  'app',
  'fallery',
  'backbonetv_widget'
], function( app, fallery ) {

  'use strict';

  return Backbone.TV.View.extend({

    id: 'profile',

    _hide: false,

    initialize: function() {
    },

    render: function() {
      var tmpl = _.template('<div class="label"><div class="title">' +
        '<%=title%></div><div class="detail"><%=detail%></div></div>');
      var items = [
        tmpl({title:'Profile', detail:''}),
      ];
      var baritems = [];
      var view = this;

      if ( fallery.meHasAuthorized() ) {
        items.push( '<div class="bar"></div><i class="icon-signout icon-large" />'
                    + tmpl({title:'Signout', detail:'You can signout from application'}) );
        items.push( '<i class="icon-cog icon-large" />'
                    + tmpl({title:'Setup', detail:'User setup for application'}) );
        items.push( '<i class="icon-facebook-sign icon-large" />'
                    + tmpl({title:'Facebook', detail:'Go to facebook'}) );
      } else {
        items.push( '<div class="bar"></div><i class="icon-signin icon-large" />'
                    + tmpl({title:'Signin', detail:'Signin with Facebook account'}) );
      }

      _.each(items, function(item) {
        baritems.push( new Backbone.TV.BarItem(item, view) );
      }, this);

      var sidebar = this.sidebar = new Backbone.TV.BarView({
        baritems:baritems
      });

      sidebar.on('view:select', function(event) {
        switch ( event.current.index ) {
          case 1: {
            this.trigger('user:' + (fallery.meHasAuthorized() ? 'signout' : 'signin'));
            break;
          }
          case 3: {
            window.open( 'https://facebook.com', '_newtab' );
            break;
          }
        }
      }, this);

      sidebar.on('view:hover', function(event) {
        if (event.related) {
          event.related.$li.find('.label').css('display', 'none');
        }
        if (event.current) {
          event.current.$li.find('.label').css('display', 'block')
        }
      });

      this.on('keyevent:focusin', function() {
        if (this.sidebar.selected() == undefined) {
          this.sidebar.hover(fallery.meHasAuthorized() ? 0 : 1);
        }
        this.sidebar.focusin()
      }, this);

      this.append(sidebar);

      return this;
    },

    hiddenLabel: function() {
      this.$el.find('.label').each(function(i, label) {
        $(label).css('display', 'none');
      });
    },

    slide: function( done ) {
      var x = this._hide ? '0px' : '-3.5em';
      var hide = this._hide = this._hide ? false : true;
      done || ( done = function(){} );
      var animDone = function() {
        done( hide );
      };
      !this._hide && this.hiddenLabel();
      this.$el.transition({ x: x }, 800, 'linear', animDone);
    },

    isSlided: function() {
      return this._hide;
    },

    profile: function( user ) {
      var profile = 'https://graph.facebook.com/' + user.id + '/picture';
      R.load( 'image://' + profile, this ).done(function(profile) {
        var animDone = _.bind(function() {
          this.trigger( 'users:change' );
        }, this);

        var item = this.$el.find('ul li:nth-child(1)');
        this.$profile = $(profile).appendTo( item );
        item.find('.label .detail').html( user.get('name') )
        this.$profile.transition({ opacity: 1 }, 800, 'linear', animDone);
      });
    }

  });

});
