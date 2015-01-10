
var errorHandler = function (message) {
  console.error("Oh noes, got an error", message);
};

var loadAndShowPhotos = function (photos) {
  function selectorFor(photoId, childSelector) {
    return "[data-photo-id='" + photoId + "'] " + childSelector;
  }

  photos.forEach(function (photo) {
    // Make an element for the photo and start loading it
    var element =
      "<li data-photo-id='" + photo.id + "' class='ImageContainer'>" +
        "<img src='" + photo.url_m + "'>" +
          "<div class='Image-metadata'>" +
            "<div class='Image-title'>" + photo.title + "</div>" +
            "<div class='Image-owner'>" + photo.ownername + "</div>" +
            "<a class='Image-link' target='_blank'> (more info)</a>" +
          "</div>" +
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
  FlickrHelpers.getGallery("11968896-72157622466344583").success(function (data) {
    loadAndShowPhotos(data.photos.photo);
  });
};

$(initializeViewer);