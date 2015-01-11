
var KittyHelpers = (function () {
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
      KittyHelpers.getBySelector(selector).innerHTML = value;
    },

    setLink: function (selector, value) {
      return KittyHelpers.getBySelector(selector).setAttribute('href', value);
    },

    setImage: function (selector, value) {
      return KittyHelpers.getBySelector(selector).setAttribute('src', value);
    }
  }
}());
