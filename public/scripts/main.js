/* global Lightbox */

document.addEventListener("DOMContentLoaded", function() {
  'use strict';
  var galleries = {
    cats2: "122204813-72157649782638748", // https://www.flickr.com/photos/122250135@N06/galleries/72157649782638748/
    kittens: "11968896-72157622466344583" // https://www.flickr.com/photos/roxdom/galleries/72157622466344583/
  };

  Lightbox.addEventListeners(document);
  Lightbox.loadAndShowGallery(galleries.kittens);
});
