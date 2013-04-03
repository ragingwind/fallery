define([
  'app',
  'fallery'
], function( app, fallery ) {

  'use strict';

  return Backbone.TV.View.extend({

    id: 'keyguide',

    R: {
      template: 'template://keyguide.html'
    },

    render: function() {
      this.$el.append(R.get(this.R.template)());
    }

  });

});
