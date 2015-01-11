function ChainableGet() {
  var XHR_COMPLETE = 4;
  var HTTP_RESPONSE_OK = 200;

  this.successFunctions = [];
  this.failFunctions = [];

  this.successHandler = function (data) {
    this.successFunctions.forEach(function (successFunc) {
      successFunc(data);
    })
  };

  this.errorHandler = function (data) {
    this.failFunctions.forEach(function (failFunc) {
      failFunc(data);
    });
  };

  this.get = function (url) {
    this.url = url;

    this.promise = new Promise(function (resolve, reject) {
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

    this.promise
      .then(this.successHandler.bind(this), this.errorHandler.bind(this))
      //.catch(this.catchHandler.bind(this));

    return this;
  };

  this.catchHandler = function (data) {
    console.error("Catch Handler! ", data);
  };

  this.success = function (fn) {
    this.successFunctions.push(fn);
    return this;
  };

  this.fail = function (fn) {
    this.failFunctions.push(fn);
    return this;
  };

  this.then = function (onFulfilled, onRejected) {
    this.promise.then(onFulfilled, onRejected);
    return this;
  };

};