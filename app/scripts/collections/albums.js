define([
  'backbone',
  'collections/opengraph',
  'models/album'
], function ( Backbone, OpenGraph, Album ) {

  'use strict';

  var Albums = OpenGraph.extend({

    model: Album,

    modelType: 'albums',

    fields: 'fields=albums.fields(id,name,count,cover_photo,link,description,created_time)'

  });

  return Albums;

});
