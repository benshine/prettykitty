
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

KittyHelpers.getBySelector= function (selector) {
  var element = document.querySelector(selector);
  if (element) {
    return element;
  } else {
    throw new Error("Could not find element with selector '" + selector + "`");
  }
};

KittyHelpers.setText = function (selector, value) {
  KittyHelpers.getBySelector(selector).innerHTML = value;
};

KittyHelpers.setLink = function (selector, value) {
  return KittyHelpers.getBySelector(selector).setAttribute('href', value);
};

KittyHelpers.setImage = function (selector, value) {
  return KittyHelpers.getBySelector(selector).setAttribute('src', value);
};
