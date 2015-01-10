
var errorHandler = function (message) {
  console.error("Oh noes, got an error", message);
};

var loadAndShowPhotos = function (photos) {
  function selectorFor(photoId, childSelector) {
    return "[data-photo-id='" + photoId + "'] " + childSelector;
  }

  photos.forEach(function (photo) {
    // Make an element for the photo and start loading it
    var element = "<li data-photo-id='" + photo.id + "' class='ImageContainer'>" +
        "<div class='Image-title'>" + photo.title + "</div>" +
        "<div class='Image-owner'>" + photo.ownername + "</div>" +
        "<a class='Image-link' target='_blank'> (more info)</a>" +
        "<img src='" + photo.url_m + "'>" +
        "</li>";
    KittyHelpers.appendTo('.Images', element);

    // Fetch more metadata and display that too
    FlickrHelpers.loadAndShowMetadata(
      photo.id,
      selectorFor(photo.id, '.Image-owner'),
      selectorFor(photo.id, '.Image-title'),
      selectorFor(photo.id,  '.Image-link')
    );
  });
};

var initializeViewer = function () {
  //FlickrHelpers.loadAndShowImage(8560841233, '.main-image');
  //FlickrHelpers.loadAndShowMetadata(8560841233, '.ImageInfo-owner', '.ImageInfo-title', '.ImageInfo-url');
  FlickrHelpers.getPhotoset("72157645734482608").success(function (data) {
    console.log("got data: ", data);
    loadAndShowPhotos(data.photoset.photo);
  });
};

$(initializeViewer);