define([
  'app',
  'models/node'
], function ( app, Node ) {

  'use strict';

  var Album = Node.extend({

    idAttribute: 'id'

  });

  return Album;

});
