
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
    var url = api_base + BJQ.encodeUrlParams(params);
    return new ChainableGet().get(url)
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

    getPhotoset: function (setId) {
      return doRequest(requestParams(
        "flickr.photosets.getPhotos",
        { photoset_id: setId, extras: 'owner_name,url,url_m' }
      ));
    },

    getGallery: function (galleryId) {
      return doRequest(requestParams(
        "flickr.galleries.getPhotos",
        { gallery_id: galleryId, extras: 'owner_name,url,url_m,url_q' }
      ));
    },

    loadAndShowImage: function (photoId, imageElementSelector, errorHandler) {
      return this.getPhotoUrls(photoId).success(function (responseText) {
        errorHandler = errorHandler || defaultErrorHandler;
        var urlInfo = JSON.parse(responseText);
        // TODO: accept different size parameters
        var imageUrl;

        if (urlInfo.stat !== "ok") {
          errorHandler("Could not load photo urls: " + urlInfo.message);
          return;
        }

        var desiredSize = "Medium"; // TODO: select size deliberately for lightbox dimensions
        var desiredSizeInfo = urlInfo.sizes.size.find(
          function (sizeInfo) { return sizeInfo.label === desiredSize }
        );

        if (desiredSizeInfo) {
          imageUrl = desiredSizeInfo.source;
        } else {
          errorHandler("Could not find size " + desiredSize);
        }

        BJQ.setImage(imageElementSelector, imageUrl);
      }).fail(errorHandler);
    },

    loadAndShowMetadata: function (photoId, ownerSelector, titleSelector, linkSelector, errorHandler) {
      errorHandler = errorHandler || defaultErrorHandler;
      this.getPhotoMetadata(photoId).success(function(responseText) {
        var metadata = JSON.parse(responseText);
        BJQ.setText(ownerSelector, metadata.photo.owner.realname || metadata.photo.owner.username || "Unknown owner" );
        BJQ.setText(titleSelector, metadata.photo.title._content || "Untitled");
        BJQ.setLink(linkSelector, (metadata.photo.urls.url[0]._content));
      }).fail(errorHandler);
    }
  };

}());