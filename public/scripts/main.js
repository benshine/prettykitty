
var onPhotoDataLoaded = function (data) {
  console.log(data);
  $('.output').text(data.toString());
};

var errorHandler = function (message) {
  console.error("Oh noes, got an error", message);
};


var initializeViewer = function () {
  FlickrHelpers.loadAndShowImage(8560841233, '.main-image')
  FlickrHelpers.loadAndShowMetadata(8560841233, '.ImageInfo-owner', '.ImageInfo-title', '.ImageInfo-url');

};

$(initializeViewer);