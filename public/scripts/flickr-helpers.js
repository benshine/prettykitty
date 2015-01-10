
var FlickrHelpers = (function () {
  var api_key = "c41f95395bce6261e24a6d635e97c49b";
  var api_base = "https://api.flickr.com/services/rest/?";

  var requestParams = function (method, queryParams) {
    return Object.assign(
      { api_key: api_key,
        method: method,
        format: "json",
        nojsoncallback: 1
      },
      queryParams
    )
  };

  var doRequest = function (params) {
    var url = api_base + KittyHelpers.encodeUrlParams(params)
    return KittyHelpers.get(url)
  };

  var defaultErrorHandler = function (message) {
    console.error("Oh noes, got an error", message);
  };

  return {
    getPhotoUrls: function (photoId) {
      return doRequest(requestParams(
        "flickr.photos.getSizes",
        { photo_id: photoId }
      ));
    },

    getPhotoMetadata: function (photoId) {
      return doRequest(requestParams(
        "flickr.photos.getInfo",
        { photo_id: photoId }
      ));
    },

    loadAndShowImage: function (photoId, imageElementSelector, errorHandler) {
      this.getPhotoUrls(photoId).success(function (urlInfo) {
        errorHandler = errorHandler || defaultErrorHandler;

        // TODO: accept different size parameters
        var imageUrl;

        if (urlInfo.stat !== "ok") {
          errorHandler("Could not load photo urls: " + urlInfo.message);
          return;
        }

        console.log("Urls: ", urlInfo);
        var desiredSize = "Medium"
        var desiredSizeInfo = urlInfo.sizes.size.find(
          function (sizeInfo) { return sizeInfo.label === desiredSize }
        );

        if (desiredSizeInfo) {
          imageUrl = desiredSizeInfo.source;
        } else {
          errorHandler("Could not find size " + desiredSize);
        }

        $(imageElementSelector).attr('src', imageUrl);
      }).fail(errorHandler);
    },

    loadAndShowMetadata: function (photoId, ownerSelector, titleSelector, linkSelector, errorHandler) {
      errorHandler = errorHandler || defaultErrorHandler;
      this.getPhotoMetadata(photoId).success(function(metadata) {
        console.log(metadata);
        $(ownerSelector).text(metadata.photo.owner.realname || metadata.photo.owner.username || "Unknown owner" );
        $(titleSelector).text(metadata.photo.title._content || "Untitled");
        $(linkSelector).attr('href', (metadata.photo.urls.url[0]._content));
      }).fail(errorHandler);


    }
  };

}());