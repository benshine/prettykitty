
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
    get: function (url) {
      return $.get.call($, url)
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
