
var hideLoading = function () {
  KittyHelpers.show('.LightBox');
  KittyHelpers.hide('.LoadingIndicator');
};

var showPhotoInLightbox = function (photoId) {
  hideLoading();

  FlickrHelpers.loadAndShowMetadata(photoId,
    '.LightBox .ImageInfo-owner',
    '.LightBox .ImageInfo-title',
    '.LightBox .ImageInfo-url'
  );
  FlickrHelpers.loadAndShowImage(photoId, '.LightBox .LightBox-mainImage')
    .then(function () {
      console.log("and then...");
    });
};

var Lightbox = (function () {
  var galleryData = undefined;
  var current = 0;
  return {
    setPhotos: function (photos) {
      galleryData = photos;
      current = 0;
    },
    goToNext: function () {
      console.log("got go to next. next will be ?");
    },
    goToPrevious: function () {
      console.log("got go to previous. prev will be ?");
    }
  }
}());

var loadAndShowPhotos = function (photos) {
  function selectorFor(photoId, childSelector) {
    return "[data-photo-id='" + photoId + "'] " + childSelector;
  }

  showPhotoInLightbox(photos[0].id);

  photos.forEach(function (photo) {
    // Make an element for the photo and start loading it
    var element =
      "<li data-photo-id='" + photo.id + "' class='Thumbnail'>" +
        "<img src='" + photo.url_q + "'>" +
          "<div class='Image-metadata'>" +
            "<div class='Image-title'>" + photo.title + "</div>" +
            "<div class='Image-owner'>" + photo.ownername + "</div>" +
            "<a class='Image-link' target='_blank'> (more info)</a>" +
          "</div>" +
        "</li>";
    KittyHelpers.appendTo('.Thumbnails', element);

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