/* global console, Promise */

function ChainableGet() {
  'use strict';

  var XHR_COMPLETE = 4;
  var HTTP_RESPONSE_OK = 200;

  this.get = function (url) {
    this.url = url;

    var promise = new Promise(function (resolve, reject) {
      var req;

      var handleStateChange = function () {
        if (req.readyState === XHR_COMPLETE) {
          if (req.status === HTTP_RESPONSE_OK) { // TODO: handle other success codes
            resolve(req.responseText);
          } else {
            reject(req);
          }
        }
      };

      req = new XMLHttpRequest();
      req.onreadystatechange = handleStateChange;
      req.open('GET', url);
      req.send();
    });

    return promise;
  };
}