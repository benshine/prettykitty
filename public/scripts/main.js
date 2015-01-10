
var onPhotoDataLoaded = function (data) {
  console.log(data);
  $('.output').text(data.toString());
};

var errorHandler = function (something) {
  console.error("Oh noes, got an error", something);
};


var initializeViewer = function () {
  //var url = "https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=c41f95395bce6261e24a6d635e97c49b&photoset_id=72157626579923453&format=json&nojsoncallback=1"
  //
  //KittyHelpers.get(url).done(onPhotoDataLoaded);
  FlickrHelpers.loadAndShowImage(5713357208, '.main-image')
};

$(initializeViewer);