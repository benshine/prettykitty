
/*
 *  BJQ: Benji's jQuery replacement
 *
 *  A minimal replacement for a few jQuery functions.
 *  These are not meant to be complete replacements, and in fact
 *  I've given them different names from the general jquery functions
 *  to make it clear that I'm not trying to support all the behavioro
 *  that jquery does. These are just focused functions to do exactly
 *  what I need for this application.
 */

var BJQ = (function () {
  return {

    // This is an incredibly simple get handler that is not meant to handle
    // all situations. Just enough for the current application.
    //
    // It does not handle invalid URLs.
    // The only success it recognizes is http code 200.
    get: function (url, successHandler, errorHandler) {
      var XHR_COMPLETE = 4;
      var HTTP_RESPONSE_OK = 200;

      var handleStateChange = function () {
        if (req.readyState === XHR_COMPLETE) {
          if (req.status === HTTP_RESPONSE_OK) { // TODO: handle other success codes
            console.log("success...", req);
            if (successHandler) {
              successHandler(req.responseText);
            }
          } else {
            console.log("error...", req);
            if (errorHandler) {
              errorHandler(req);
            }
          }
        }
      };

      req = new XMLHttpRequest();
      req.onreadystatechange = handleStateChange;
      req.open('GET', url);
      req.send();

      // return $.get.call($, url).success(success).fail(error);



    },

    encodeUrlParams:   function (params) {
      return Object.keys(params)
        .map(function (cur) {  return cur + "=" + params[cur]; })
        .join('&')
    },

    getBySelector: function (selector) {
      var element = document.querySelector(selector);
      if (element) {
        return element;
      } else {
        throw new Error("Could not find element with selector '" + selector + "`");
      }
    },

    setText: function (selector, value) {
      BJQ.getBySelector(selector).innerHTML = value;
    },

    setLink: function (selector, value) {
      return BJQ.getBySelector(selector).setAttribute('href', value);
    },

    setImage: function (selector, value) {
      return BJQ.getBySelector(selector).setAttribute('src', value);
    }
  }
}());
