var dns = require('dns');
var os = require('os');

// module prototype.
var netutil = module.exports = exports = {};

// module functions.
netutil.hostaddr = function(done) {
  dns.lookup(os.hostname(), function (err, address, fam) {
    done({ host: os.hostname(), address: address });
  });
};

netutil.ifconfig = function() {
  var ifaces = os.networkInterfaces();
  var devs = []
  for (var dev in ifaces) {
    var alias = 0;
    ifaces[dev].forEach( function( details ) {
      if ( details.family ==='IPv4' ) {
        devs.push( dev + ( alias ? ':' + alias : '' ), details.address );
        ++alias;
      }
    });
  }
  return devs;
};

netutil.clientaddr = function(req) {
  var ipAddress;

  // Amazon EC2 / Heroku workaround to get real client IP
  var forwardedIpsStr = req.header('x-forwarded-for');
  if (forwardedIpsStr) {

    // 'x-forwarded-for' header may return multiple IP addresses in
    // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
    // the first one
    var forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    // Ensure getting client IP address still works in
    // development environment
    ipAddress = req.connection.remoteAddress;
  }
  return ipAddress;
};
