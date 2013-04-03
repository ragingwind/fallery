define([
  'app',
  'views/list',
  'backbonetv',
], function( app, List ) {

  'use strict';

  var Items = Backbone.Collection.extend({});

  return Backbone.TV.View.extend({

    id: 'testList',

    initialize: function() {
      this.items = new Items();
      for (var i = 0, max = 20; i < max; ++i) {
        this.items.add({ name: 'name' + i, age: i + 10 });
      }

      _.extend(this.items, {
        at: function(index) {
          var model = Backbone.Collection.prototype.at.call(this, index);
          var html;
          if ( model ) {
            html = '<div class="item">' + model.get('name') + '</div>';
          }
          return html;
        }
      });

      this.list = new List({ rowCount: 10});
      this.list.on( 'view:select', this.listItemSelected );
      this.on( 'render:after', this.afterRender, this );
      this.list.items( this.items );
    },

    listItemSelected: function() {
      console.log( 'listItemSelected', arguments );
    },

    listItem: function( opts ) {
      console.log( opts );
      opts.item = [1,2,3];
      return [1,2,3,];
    },

    render: function() {
      this.append( this.list );
    },

    afterRender: function() {
      this.list.select(0);
    }

  });

});
