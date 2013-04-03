'use strict';

var netutil = require('../libs/netutil');

module.exports = function(app) {

  app.get('/dashboard', function(req, res) {
    netutil.hostaddr(function(address) {
      res.send({
        config: app.config,
        hostaddr: address,
        ifconfig: netutil.ifconfig()
      })
    })
  });

};

