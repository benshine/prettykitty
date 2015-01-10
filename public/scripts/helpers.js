
var KittyHelpers = KittyHelpers || {};

KittyHelpers.get = function (url) {
  return $.get.call($, url)
};

KittyHelpers.encodeUrlParams =  function (params) {
  return Object.keys(params)
    .map(function (cur) {  return cur + "=" + params[cur]; })
    .join('&')
};
