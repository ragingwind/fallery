var ajax = function(opts, callback) {
  var xhr = new XMLHttpRequest();
  var method = opts.method.toUpperCase();
  var url = opts.url;
  var async = ('async' in opts) ? opts.async : false;
  // var contentType = ('contentType' in opts) ? opts.contentType : 'text/html';
  var headers = opts.headers;
  var data = opts.data || null;

  xhr.open(opts.method, opts.url, opts.async)
  // @REMOVE, Request header field Content-Type is not allowed
  // by Access-Control-Allow-Headers.
  // xhr.setRequestHeader('Content-Type', contentType);

  if (headers) {
    for (var key in headers) {
      xhr.setRequestHeader(key, headers[key]);
    }
  }

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      var status = function(s) {
        return ((s >= 200 && s < 300) || s == 304) ? 'success' : 'error';
      }

      callback({
        status: status(xhr.status),
        statusCode: xhr.status,
        textStatus: xhr.statusText,
        responseText: xhr.responseText,
        xhr:JSON.stringify(xhr)
      });
    }
  };

  xhr.send(data);
};

self.addEventListener('message', function(message) {
  var options = message.data;
  ajax(options, function(response) {
    options.type = 'response';
    options.response = response;
    postMessage(options);
  });
}, false);
