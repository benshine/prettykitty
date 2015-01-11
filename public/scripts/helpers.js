
var KittyHelpers = KittyHelpers || {};

// TODO: replace all of these jquery calls with functions I write myself

KittyHelpers.get = function (url) {
  return $.get.call($, url)
};

KittyHelpers.encodeUrlParams =  function (params) {
  return Object.keys(params)
    .map(function (cur) {  return cur + "=" + params[cur]; })
    .join('&')
};

KittyHelpers.setText = function (selector, value) {
  return $(selector).text(value);
};

KittyHelpers.setLink = function (selector, value) {
  return $(selector).attr('href', value);
};

KittyHelpers.setImage = function (selector, value) {
  return $(selector).attr('src', value);
};

KittyHelpers.appendTo = function (selector, elements) {
  return $(selector).append(elements);
};

KittyHelpers.show = function (selector) {
  return $(selector).show();
};

KittyHelpers.hide = function (selector) {
  return $(selector).hide();
};