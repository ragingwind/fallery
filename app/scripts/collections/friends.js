define([
  'backbone',
  'collections/opengraph',
  'models/user'
], function ( Backbone, OpenGraph, User ) {

  'use strict';

  var Friends = OpenGraph.extend({

    model: User,

    modelType: 'friends',

    node: 'me',

    fields: 'fields=friends.fields(id,name,first_name,last_name,link,username,cover)'

  });

  return Friends;

});
