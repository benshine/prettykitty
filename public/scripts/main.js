'use strict';

document.addEventListener("DOMContentLoaded", function() {

  Lightbox.addEventListeners(document);
  //FlickrHelpers.getGallery("11968896-72157622466344583").success(function (data) {
  //  console.log("got data: ", data);
  //});

  //FlickrHelpers.getPhotoUrls("2805432983").success(function (yay) {
  //  console.log("success for photo urls: ", yay);
  //});
  var photoId = "2805432983";
  FlickrHelpers.loadAndShowImage(photoId, '.LightBox .LightBox-mainImage');
  FlickrHelpers.loadAndShowMetadata(photoId,
    '.LightBox .ImageInfo-owner',
    '.LightBox .ImageInfo-title',
    '.LightBox .ImageInfo-url'
  );


  //Lightbox.loadAndShowGallery("11968896-72157622466344583");
});
