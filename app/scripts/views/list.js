define([
  'backbonetv'
], function() {

  'use strict';

  return Backbone.TV.View.extend({

    constructor: function(options) {
      options || ( options = {} );
      _.defaults(options, {
        vertical: true,
        visibleCount: 10,
        items: undefined,
        marginCount: 2
      });

      _.defaults(this, {
        _selected: -1,
        _hovered: -1
      });

      this.$ul = $('<ul></ul>');

      Backbone.TV.View.call(this, options);
    },

    initialize: function() {
      var vertical = this.options.vertical;
      var keys = {
        vertical: 'keydown:up keydown:down',
        horizotal: 'keydown:right keydown:left'
      };

      this.on('keydown:enter', function() {
        this.select(this._hovered);
      }, this);

      this.on(vertical ? keys.vertical : keys.horizotal, function(responder, event) {
        this.traverse(responder, event);
      }, this);

      this.on(vertical ? keys.horizotal : keys.vertical , function() {
        var derailEvent = {
          keyevent: Backbone.TV.KeyboardEvent.event(),
          from: this,
          selected: this._selected,
          hovered: this._hovered
        }

        this.trigger('view:derail', derailEvent);
      }, this);

      this.on('keyevent:focusin', function() {
        this._selected >= 0 && this.hover(this._selected);
      }, this);

      this.on('keyevent:focusout', function() {
        this.hover(-1);
      }, this);
    },


    insertItem: function( insert, index, item ) {
      this.$ul[insert]('<li data-index="' + (item ? index : -1) + '">' +
                      (item ? item : '') + '</li>');
    },

    appendItem: function( index ) {
      this.insertItem('append', index, this.options.items.at(index));
    },

    prependItem: function( index ) {
      this.insertItem('prepend', index, this.options.items.at(index));
    },

    scrollPrev: function() {
      var length = this.options.items.length;
      var loop = length > this.options.visibleCount;
      if (loop || this._hovered > 0) {
        var margin = this.options.marginCount + 1;
        var prev;
        if (!loop) {
          prev = (this._hovered >= margin) ? this._hovered - margin : -1;
        } else {
          var first = parseInt(this.childrens(0).attr('data-index'));
          prev = (first - 1 >= 0) ? first - 1 : length - 1;
        }
        this.prependItem(prev);
        this.hover( (this._hovered - 1 >= 0) ? this._hovered - 1 : (loop) ? length - 1 : this._hovered );
        this.childrens().length > this.options.visibleCount && this.childrens(-1).remove();
      }
    },

    scrollNext: function() {
      var length = this.options.items.length;
      var overflow = this.childrens().length > this.options.marginCount + 1;
      var loop = length > this.options.visibleCount;

      if (overflow) {
        var last = parseInt(this.childrens(-1).attr('data-index'));
        var next = (last + 1 < length) ? last + 1 : (loop) ? 0 : undefined;
        next !== undefined && this.appendItem(next);
        this.hover( (this._hovered + 1 >= length) ? 0 : this._hovered + 1 );
        this.childrens(0).remove();
      }
    },

    fill: function() {
      if (this.options.items && this.options.items.length > 0) {
        var margin = this.options.marginCount;
        var length = this.options.items.length;
        var count = this.options.visibleCount - this.options.marginCount;
        var tail = this.options.visibleCount < length ? length : this.options.visibleCount;
        this.$ul.children('li').remove();
        while (margin) { this.appendItem(tail - margin--); };
        count > length && ( count = length );
        _.times(count, function(c) { this.appendItem(c); }, this);
      }
    },

    items: function( items ) {
      if (items) {
        this.options.items = items;
        this.fill();
      }
      return this.options.items;
    },

    render: function() {
      this.$el.append(this.$ul);
      this.fill();
      return this;
    },

    childrens: function( param ) {
      if (param != undefined && _.isNumber(param)) {
        var childrens = this.$ul.children('li');
        return $(childrens[ param >= 0 ? param : childrens.length - 1 ]);
      } else if (typeof param === 'object') {
        return this.$ul.children('li[data-index=' + param.index + ']');
      } else {
        return this.$ul.children('li');
      }
    },

    traverse: function(responder, event) {
      var index = (this._hovered) ? this._hovered : -1;
      var max = this.childrens().length;
      var prev = (event.keyid == 'up' || event.keyid == 'left');
      prev ? this.scrollPrev() : this.scrollNext();
    },

    hover: function(index) {
      this.childrens({ index: index }).addClass('hover');
      this.childrens({ index: this._hovered }).removeClass('hover');
      this.trigger('view:hover', { current: index, related: this._hovered });
      this._hovered = index;
      return this;
    },

    select: function(index) {
      if (this._selected !== index) {
        var $item = this.childrens({index: index});
        if ( $item.length > 0 ) {
          $item.addClass('select');
          this.childrens({ index: this._selected }).removeClass('select');
          this.trigger('view:select', { current: index, related: this._selected });
          this._selected = index;
          this.focusin();
        }
      }
      return this;
    },

    hovered: function() {
      return this.childrens({ index: this._hovered });
    }

  });
});
