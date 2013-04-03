define([
  'app'
],

function(app) {

  "use strict";

  return Backbone.TV.View.extend({
    initialize: function() {
      // extend utility jquery fn
      (function($){
        $.fn.boundary = function() {
          var pos = this.position();
          var width = $(this).width();
          return {
            left: pos ? pos.left - width : 0,
            right: pos ? pos.left + width : 0
          };
        }

        $.fn.exists = function () {
          return this.length !== 0;
        }
      })(jQuery);
    },

    reset: function() {
      this.clean();
      this.datasource && delete this.datasource;
      this.datasource = new Backbone.Collection();
      this.datasource.on('add', this._datasourceDidAdd, this)
                     .on('remove', this._datasourceDidRemove, this);
      return this.datasource;
    },

    // insert new slide with new model.
    _datasourceDidAdd: function(model) {
      model.on('change', this.update, this);
      this.insert(model);
    },

    // remove slide by removed model
    _datasourceDidRemove: function(model) {
      this.remove(model);
    },

    // generate slide template.
    _slide: function(index) {
      var model = this.datasource.at(index);
      var contents = $(model.get('contents')).clone(true);
      return $('<div></div>').attr({ 'data-cid': model.cid })
                             .css({ 'position': 'absolute' })
                             .append(contents);
    },

    // return slide length in visiblity.
    length: function() {
      return this.$el.children().length;
    },

    // remove all children.
    clean: function() {
      this.$el.empty();
    },

    // reload slide from zero, if slider is empty, or it's not empty?
    // reload slide from current front position.
    reload: function(max) {
      var start = this.length() === 0 ? 0 : this.front().index;
      max = _.min([ start + max, this.datasource.length - 1 ]);
      this.clean();
      for (; start < max; ++start) {
        this._insertAfter(undefined, this._slide( start ), this.datasource.at( start ));
      }
      return this;
    },

    // return cid from element attribute.
    getByCid: function(cid) {
      return this.$el.find('[data-cid="' + cid + '"]')[0];
    },

    // get model from datasource by element attribute.
    getModelByElement: function(elem) {
      return this.datasource.get( $(elem).attr('data-cid') );
    },

    // return index and model at front.
    front: function() {
      var elem = this.$el.children()[0];
      var model = this.getModelByElement(elem);
      return {
        index: model ? this.datasource.indexOf(model) : -1,
        model : model
      };
    },

    // insert slide after the element. if the element is undefined?
    // the slide goint to append to parent element.
    _insertAfter: function(elem, slide, model) {
      var delegate = {
        elem: elem,
        parent: this.$el,
        left: elem ? $(elem).boundary().right : 0,
        slide: slide,
        model: model,
        call: function() {
          this.slide.css({ left: this.parent.children().length * $(elem).width() });
          this.elem ? $(slide).insertAfter(this.elem) : this.parent.append(slide);
        }
      }

      this.trigger('sliderview:addto', delegate);
    },

    // insert slide before the elelemt. the element must be exist.
    _insertBefore: function(elem, slide, model) {
      var delegate = {
        elem: elem,
        left: $(elem).boundary().left - slide.width(),
        slide: slide,
        model: model,
        call: function() {
          this.slide.css({ left: this.left });
          $(this.elem).before(this.slide);
        }
      }

      this.trigger('sliderview:addto', delegate);
    },

    // move element to right side of previous.
    _moveToPrev: function(elem) {
      var prev = $(elem).prev();
      var move = {
        elem: elem,
        prev: prev,
        left: prev.exists() ? $(prev).boundary().right : 0,
        call: function() {
          $(this.elem).css({ left: this.left });
        }
      };

      this.trigger('sliderview:moveto', move);
    },

    // move element to left or right side of the element.
    _moveTo: function(elem, left) {
      var move = {
        elem: elem,
        left: left ? $(elem).boundary().left : $(elem).boundary().right,
        call: function() {
          $(this.elem).css({ left: this.left });
        }
      };

      this.trigger('sliderview:moveto', move);
    },

    // insert slide with the model, after insert, rest element should be
    // moved to right side.
    insert: function(model) {
      var index = this.datasource.indexOf(model);
      var slide = this._slide(index);
      var prev = this.datasource.at(index - 1);

      this._insertAfter(prev && this.getByCid(prev.cid), slide, model);

      _.each(slide.nextAll(), function(elem) {
        this._moveTo(elem, false);
      }, this);

      return this;
    },

    // slide insert to front of slides.
    unshift: function() {
      var elem = _.first(this.$el.children());
      var model = this.getModelByElement(elem);
      if (model !== undefined) {
        var index = this.datasource.indexOf(model);
        index !== 0 && this._insertBefore(elem, this._slide(index - 1), model);
      }

      return this;
    },

    // add new slide after last slide in slider.
    push: function() {
      var model = this.getModelByElement( this.$el.children().last() );
      var index = this.datasource.indexOf(model);
      model = this.datasource.at(index + 1);
      if (model !== undefined) {
        this.insert(model);
      } else {
        this.trigger('sliderview:endofdata');
      }
      return this;
    },

    // update by model's contents.
    update: function(model) {
      var elem = this.getByCid(model.cid);
      elem !== undefined && $(elem).empty().append( model.get('contents') );
    },

    // make slide to left.
    slideLeft: function() {
      var childrens = this.$el.children();
      _.each(childrens, function(elem) { this._moveTo(elem, true); }, this);
      return this;
    },

    // make slide to right.
    slideRight: function() {
      var childrens = this.$el.children().get().reverse();
      _.each(childrens, function(elem) { this._moveTo(elem, false); }, this);
      return this;
    },

    // remove by the model. rest element should be moved to left side.
    remove: function(model) {
      if (model === undefined) return;
      var elem = this.getByCid(model.cid);

      if (elem) {
        var deferred = $.Deferred();
        deferred.context = this;
        deferred.rest = $(elem).nextAll();
        deferred.done(function() {
          _.each(this.rest, function(elem) {
            this._moveToPrev(elem);
          }, this.context);
        });

        var delegate = {
          elem: elem,
          call: function() {
            this.elem && $(this.elem).remove();
            this.after.resolve();
          },
          after: deferred
        };

        this.trigger('sliderview:remove', delegate);
      }

      return this;
    },

    // remove front slide of slider.
    shift: function() {
      this.remove( this.getModelByElement(this.$el.children()[0]) );
      return this;
    },

    // remove end slide of slider.
    pop: function() {
      this.remove( this.getModelByElement(this.$el.children().last()) );
      return this;
    }
  });

});
