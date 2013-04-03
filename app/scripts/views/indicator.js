define([ 'app' ], function(app) {

  "use strict";

  var Indicator = Backbone.TV.View.extend({

    id: 'loading',

    initialize: function() {
      this.on('render:after', this.afterRender, this);
    },

    render: function() {
      // this.append(new Backbone.TV.View({ id:'logo' }));
    },

    afterRender: function() {
      // this.$el.text('Fallery');
      // this.$el.append('<img src="/images/fallery-logo.png"></img>')
    }

  });

  return Indicator;

});
