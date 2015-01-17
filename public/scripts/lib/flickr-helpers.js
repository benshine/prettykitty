/* global BJQ, console */

var FlickrHelpers = (function () {
  'use strict';

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
    );
  };

  var doRequest = function (params) {
    var url = api_base + BJQ.encodeUrlParams(params);
    return BJQ.get(url);
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

    getLargestUpTo: function (photoId, sizeDescriptor) {
      var self = this;
      var promise = new Promise(function (resolve, reject) {
        return self.getPhotoUrls(photoId).success(function (responseText) {
          var urlInfo = JSON.parse(responseText);
          if (urlInfo.stat !== "ok") {
            reject("Could not load photo sizes: " + urlInfo.message);
            return;
          }

          var maxWidth = sizeDescriptor.width;
          var maxHeight = sizeDescriptor.height;

          if (!maxHeight || !maxWidth) {
            reject("must specify width and height");
          }

          var sizeOptions = urlInfo.sizes.size;
          // TODO: die if there are no sizes
          var zeroSizeImageDescriptor = { width: 0, height: 0 };

          // Note that flickr sometimes gives us strings and sometimes gives us
          // number literals, so we have to parseInt everything to ensure returning
          // size dimensions as numbers.

          var bestMatch = sizeOptions.reduce( function (bestSoFar, current) {
            var curWidth =  parseInt(current.width);
            var curHeight = parseInt(current.height);

            //console.log("bestSoFar width, height", bestSoFar.width, bestSoFar.height);
            //console.log("current width, height", current.width, current.height);

            if (self.between(bestSoFar.width, curWidth, maxWidth) &&
                self.between(bestSoFar.height, curHeight, maxHeight)
            ) {
              bestSoFar = current;
              bestSoFar.width = curWidth;
              bestSoFar.height = curHeight;
            }

            return bestSoFar; // trivially incorrect implementation
          }, zeroSizeImageDescriptor);

          if (bestMatch.width === 0 && bestMatch.height === 0) {
            reject("no valid images found");
          }

          resolve(bestMatch);
        });
      });

      promise.success = promise.then;
      return promise;
    },

    between: function(min, it, max) {
      return (it > min && it < max);
    },

    loadAndShowImage: function (photoId, imageElementSelector, errorHandler) {
      var largestSizeDesired = {
        width: 1025,
        height: 1000
      };
      var self = this;

      var promise = new Promise(function (resolve, reject) {
        self.getLargestUpTo(photoId, largestSizeDesired)
          .then(
          function (photoData) { // success handler
            // Explicitly set width and height now to prevent reflow when the image loads
            BJQ.setWidthAndHeight(imageElementSelector, photoData.width, photoData.height);
            BJQ.setImage(imageElementSelector, photoData.source);
            resolve("completed");
          },
          function (info) { reject("trouble" + info); }
        );
      });

      promise.success = promise.then;

      return promise;
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