define([
  'collections/opengraph',
  'models/node'
], function ( OpenGraph, Node ) {

  'use strict';

  var Photos = OpenGraph.extend({

    model: Node,

    modelType: 'photos',

    node: function() {
      return this.album.id + '/photos';
    }

  });

  return Photos;

});
