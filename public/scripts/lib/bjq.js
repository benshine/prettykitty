/* global ChainableGet */

/*
 *  BJQ: Benji's jQuery replacement
 *
 *  A minimal replacement for a few jQuery functions.
 *  These are not meant to be complete replacements, and in fact
 *  I've given them different names from the general jquery functions
 *  to make it clear that I'm not trying to support all the behaviors
 *  that jquery does. These are just focused functions to do exactly
 *  what I need for this application.
 */

var BJQ = (function () {
  'use strict';

  return {

    // This is an incredibly simple get handler that is not meant to handle
    // all situations. Just enough for the current application.
    // It returns a ChainableGet, which has three chainable methods:
    // `success`, `fail`, and `then`
    // See flickr-helpers.js for usage examples
    get: function (url) {
      return new ChainableGet().get(url);
    },

    encodeUrlParams:   function (params) {
      return Object.keys(params)
        .map(function (cur) {  return cur + "=" + params[cur]; })
        .join('&');
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
  };
}());
